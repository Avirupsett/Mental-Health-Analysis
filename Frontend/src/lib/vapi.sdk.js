'use client';

import Vapi from "@vapi-ai/web";
import { useState, useEffect } from 'react';

// export const vapi = new Vapi({
//     apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY,
//     assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
// });

export function useVapiClient() {
  const [client, setClient] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Initialize Vapi client with your API key
      const vapiClient = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
      
      // Set up event listeners
      vapiClient.on("call-start", () => {
        console.log("Call has started");
      });
      
      vapiClient.on("call-end", () => {
        console.log("Call has ended");
      });
      
      vapiClient.on("speech-start", () => {
        console.log("Assistant speech started");
      });
      
      vapiClient.on("speech-end", () => {
        console.log("Assistant speech ended");
      });
      
      vapiClient.on("message", (message) => {
        console.log("Received message:", message);
      });
      
      vapiClient.on("error", (err) => {
        console.error("Vapi error:", err);
        setError(err);
      });
      
      setClient(vapiClient);
      setIsReady(true);
    } catch (err) {
      console.error("Failed to initialize Vapi client:", err);
      setError(err);
    }
  }, []);

  return { client, isReady, error };
}

export async function startVapiCall(client, assistantId, overrides = {}) {
  if (!client) return null;
  
  try {
    const call = await client.start(assistantId, overrides);
    return call;
  } catch (error) {
    console.error("Failed to start Vapi call:", error);
    throw error;
  }
}

export function stopVapiCall(client) {
  if (!client) return;
  client.stop();
}

export function sendVapiMessage(client, message) {
  if (!client) return;
  
  client.send({
    type: "add-message",
    message: {
      role: "user",
      content: message,
    },
  });
}

export function setVoiceInput(client, enabled) {
  if (!client) return;
  client.setMuted(!enabled);
  return enabled;
}