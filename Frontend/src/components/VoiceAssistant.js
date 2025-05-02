"use client";

import { useState, useRef, useEffect } from "react";
import { BsChatDots } from "react-icons/bs";
import {
	FaMicrophone,
	FaTimes,
	FaPaperPlane,
	FaVolumeUp,
} from "react-icons/fa";
import {
	useVapiClient,
	startVapiCall,
	stopVapiCall,
	sendVapiMessage,
} from "../lib/vapi.sdk";

export default function VoiceAssistant() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			text: "Hello! I'm your mental health assistant. How can I help you today?",
			sender: "assistant",
		},
	]);
	const [inputText, setInputText] = useState("");
	const [isListening, setIsListening] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [activeCall, setActiveCall] = useState(null);
	const [liveTranscript, setLiveTranscript] = useState("");
	const [isSpeaking, setIsSpeaking] = useState(false);
	const messagesEndRef = useRef(null);
	const { client, isReady, error } = useVapiClient();

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, liveTranscript]);

	// Set up message listener when client is ready
	useEffect(() => {
		if (!client) return;

		const handleMessage = (message) => {
			console.log("Received message:", message);

			// Handle speech status updates
			if (message.type === "speech-update") {
				setIsSpeaking(message.status === "started");
			}

			// Handle user transcript messages (voice-to-text)
			else if (
				message.type === "transcript" &&
				message.transcript?.text &&
				message.role === "user"
			) {
				// Show live transcript while user is speaking
				if (message.transcriptType === "partial" && isListening) {
					setLiveTranscript(message.transcript.text);
				}

				// If it's a final transcript, add it as a user message
				if (message.transcriptType === "final") {
					setMessages((prev) => [
						...prev,
						{
							text: message.transcript.text,
							sender: "user",
						},
					]);
					setLiveTranscript("");
					setInputText("");
				}
			}

			// Handle assistant transcript messages (text-to-speech)
			else if (
				message.type === "transcript" &&
				message.transcript?.text &&
				message.role === "assistant"
			) {
				console.log(
					"Processing assistant transcript:",
					message.transcript.text,
					message.transcriptType
				);

				// If it's a final transcript, add it as an assistant message
				if (message.transcriptType === "final") {
					// Check if this is a duplicate message
					const newText = message.transcript.text;
					setMessages((prev) => {
						// Check if this message is already in our list
						const isDuplicate = prev.some(
							(m) => m.sender === "assistant" && m.text === newText
						);

						if (!isDuplicate) {
							return [
								...prev,
								{
									text: newText,
									sender: "assistant",
								},
							];
						}
						return prev;
					});
					setIsProcessing(false);
				}
			}

			// Handle conversation updates (contains messages)
			else if (message.type === "conversation-update" && message.messages) {
				// Process any new messages from the conversation update
				const newMessages = message.messages.filter(
					(msg) => msg.role === "assistant" && msg.content && msg.content.trim()
				);

				if (newMessages.length > 0) {
					const latestMessage = newMessages[newMessages.length - 1];
					// Only add if it's not a duplicate
					setMessages((prev) => {
						// Check if this message is already in our list
						const isDuplicate = prev.some(
							(m) =>
								m.sender === "assistant" && m.text === latestMessage.content
						);

						if (!isDuplicate) {
							return [
								...prev,
								{
									text: latestMessage.content,
									sender: "assistant",
								},
							];
						}
						return prev;
					});
					setIsProcessing(false);
				}
			}

			// Handle assistant messages
			else if (
				message.type === "assistant-message" &&
				message.message?.content
			) {
				setMessages((prev) => [
					...prev,
					{
						text: message.message.content,
						sender: "assistant",
					},
				]);
				setIsProcessing(false);
			}
		};

		// Add event listener
		client.on("message", handleMessage);

		// Clean up
		return () => {
			client.off("message", handleMessage);
		};
	}, [client, isListening]);

	const startCall = async () => {
		if (!isReady || !client) return;

		try {
			setIsProcessing(true);
			const call = await startVapiCall(
				client,
				process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
			);
			setActiveCall(call);
			setIsProcessing(false);
		} catch (error) {
			console.error("Failed to start call:", error);
			setIsProcessing(false);
		}
	};

	const handleVoice = () => {
		if (!client) return;

		if (isListening) {
			// Turn off voice input
			client.setMuted(true);
			setIsListening(false);
			setLiveTranscript("");
		} else {
			// If no active call, start one first
			if (!activeCall) {
				setIsProcessing(true);
				startCall()
					.then(() => {
						// Once call is started, unmute and start listening
						client.setMuted(false);
						setIsListening(true);
						setIsProcessing(false);
					})
					.catch((error) => {
						console.error("Failed to start call:", error);
						setIsProcessing(false);
					});
			} else {
				// Call already active, just unmute
				client.setMuted(false);
				setIsListening(true);
			}
		}
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!inputText.trim() || isProcessing || !client) return;

		// Add user message to chat
		setMessages((prev) => [...prev, { text: inputText, sender: "user" }]);
		setIsProcessing(true);

		try {
			// If no active call, start one
			if (!activeCall) {
				await startCall();
			}

			// Send message to Vapi
			sendVapiMessage(client, inputText);
			setInputText("");
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages((prev) => [
				...prev,
				{
					text: "I'm sorry, I encountered an error. Please try again.",
					sender: "assistant",
				},
			]);
			setIsProcessing(false);
		}
	};

	const handleClose = () => {
		if (client && activeCall) {
			// Make sure voice is turned off
			client.setMuted(true);
			setIsListening(false);
			setLiveTranscript("");

			// Stop the active call
			stopVapiCall(client);
			setActiveCall(null);
		}
		// Reset all states
		setIsOpen(false);
		setIsProcessing(false);
		setInputText("");
	};

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{isOpen ? (
				<div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
					{/* Header */}
					<div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
						<h3 className="font-semibold">Mental Health Assistant</h3>
						<button
							onClick={handleClose}
							className="hover:bg-purple-700 p-1 rounded"
						>
							<FaTimes />
						</button>
					</div>

					{/* Messages */}
					<div className="flex-1 p-4 overflow-y-auto bg-gray-50">
						{messages.map((message, index) => (
							<div
								key={index}
								className={`mb-4 p-3 rounded-lg max-w-[80%] ${
									message.sender === "user"
										? "ml-auto bg-purple-100"
										: "mr-auto bg-white border border-gray-200"
								}`}
							>
								{message.text}
								{message.sender === "assistant" && (
									<div className="mt-1 text-xs text-gray-500 flex items-center">
										<FaVolumeUp
											className={`mr-1 ${isSpeaking ? "text-purple-600" : ""}`}
										/>
										{isSpeaking ? "Speaking..." : "AI Assistant"}
									</div>
								)}
							</div>
						))}

						{/* Live transcript */}
						{liveTranscript && (
							<div className="ml-auto bg-purple-50 p-3 rounded-lg max-w-[80%] mb-4 border border-purple-100 italic text-gray-600">
								{liveTranscript}
							</div>
						)}

						{/* Processing indicator */}
						{isProcessing && !liveTranscript && (
							<div className="mr-auto bg-white border border-gray-200 p-3 rounded-lg max-w-[80%] mb-4">
								<div className="flex space-x-2">
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
									<div
										className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style={{ animationDelay: "0.2s" }}
									></div>
									<div
										className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style={{ animationDelay: "0.4s" }}
									></div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input */}
					<div className="border-t p-4">
						<form onSubmit={handleSendMessage} className="flex gap-2">
							<input
								type="text"
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								placeholder={
									isListening ? "Listening..." : "Type your message..."
								}
								className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-purple-600"
								disabled={isProcessing || !isReady}
							/>
							<button
								type="button"
								onClick={handleVoice}
								disabled={isProcessing || !isReady}
								className={`p-3 rounded-full ${
									isListening
										? "bg-red-500 animate-pulse"
										: !isReady
										? "bg-gray-400"
										: "bg-purple-600 hover:bg-purple-700"
								} text-white`}
							>
								<FaMicrophone />
							</button>
							<button
								type="submit"
								disabled={!inputText.trim() || isProcessing || !isReady}
								className={`p-3 rounded-full ${
									!inputText.trim() || isProcessing || !isReady
										? "bg-gray-400"
										: "bg-purple-600 hover:bg-purple-700"
								} text-white`}
							>
								<FaPaperPlane />
							</button>
						</form>
					</div>
				</div>
			) : (
				<button
					onClick={() => setIsOpen(true)}
					className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300"
				>
					<BsChatDots className="text-xl" />
				</button>
			)}
		</div>
	);
}
