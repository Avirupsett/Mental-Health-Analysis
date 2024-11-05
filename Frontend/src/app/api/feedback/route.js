import { NextResponse } from 'next/server';
import UserResponses from '../../../models/userAnalytics';
import connectDB from '../../../lib/connectDB';
import { getUser } from '@workos-inc/authkit-nextjs';

function getStressType(stress_level){
    let stress_type;
    if (stress_level <30) {
        stress_type = "Low"
    }
    else if (stress_level <70) {
        stress_type = "Moderate"
    }
    else if (stress_level <90) {
        stress_type = "High"
    }
    else {
        stress_type = "Very High"
    }
    return stress_type;         
}

function getColor(stress_type){
    let bg_color;let text_color;let border_color;
    if (stress_type === "Low"){
        bg_color = "#D1FAE5";
        text_color = "#047857";
        border_color = "#34D399";
    }
    else if (stress_type === "Moderate"){
        bg_color = "#FEF9C3";
        text_color = "#B45309";
        border_color = "#FBBF24";
    }
    else if (stress_type === "High"){
        bg_color = "#FFEDD5";
        text_color = "#C2410C";
        border_color = "#FB923C";
    }
    else {
        bg_color = "#FEE2E2";
        text_color = "#B91C1C";
        border_color = "#F87171";
    }
    return {bg_color, text_color, border_color};
}

export async function POST() {
  try {
    await connectDB();
    const { user } = await getUser();
    const userId = user.id;

    const userResponses = await UserResponses.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();

    const formattedResponses = userResponses.map((response, index) => {
      const dateTime = new Date(response.created_at);
      const stress_type = getStressType(response.analysis_result['Stress Level']);
      const color = getColor(stress_type);
      return {
        'sl no.': index + 1,
        'stress type': stress_type,
        'color': color,
        'stress level': parseInt(response.analysis_result['Stress Level'].toFixed(0)),
        'Date': dateTime.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }),
        'Time': new Date(dateTime.toISOString()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      };
    });

    return NextResponse.json(formattedResponses);
  } catch (error) {
    console.error('Error fetching user responses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



