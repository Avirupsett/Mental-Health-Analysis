import { NextResponse } from 'next/server';

export async function POST(req) {
  // Parse JSON body from the request
  const { to, subject, body } = await req.json();

  const res = await fetch('https://send.api.mailtrap.io/api/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAIL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: { email: "hello@demomailtrap.co", name: "Mentrix" },
      to: [{ email: "deycharles20001@gmail.com" }],
      subject: subject,
      text: body,
      category: "Mentrix"
    })
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}