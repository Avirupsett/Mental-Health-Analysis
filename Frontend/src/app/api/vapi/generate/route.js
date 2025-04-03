import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, conversationId } = await request.json();
    
    console.log('Received request:', { text, conversationId });
    console.log('Using API key:', process.env.NEXT_PUBLIC_VAPI_API_KEY);
    
    // Prepare request body for Vapi
    const requestBody = {
      assistant_id: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      input: {
        text: text
      }
    };
    
    // Add conversation_id if provided
    if (conversationId) {
      requestBody.conversation_id = conversationId;
    }
    
    console.log('Sending request to Vapi:', JSON.stringify(requestBody));
    
    // Call Vapi API - using the correct endpoint
    const response = await fetch('https://api.vapi.ai/api/assistant/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VAPI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vapi API error response:', errorText);
      throw new Error(`Vapi API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Vapi API response:', data);
    
    return NextResponse.json({
      content: data.output?.text || "I'm sorry, I couldn't process that request.",
      conversation_id: data.conversation_id
    });
  } catch (error) {
    console.error('Vapi API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}