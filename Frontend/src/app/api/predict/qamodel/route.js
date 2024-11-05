import { NextResponse } from 'next/server';
import UserResponses from '../../../../models/userAnalytics';
import UserInfo from '../../../../models/userInfo';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';
import Progress from '../../../../models/progress';
import qaAssignment from '../../../../models/qaAssignment';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req) {
    await connectDB();
    const { user } = await getUser();

    let data = await req.json()
    const userInfo = await UserInfo.findOne({ user_id: user.id });
    data['Gender'] = userInfo ? userInfo.gender.charAt(0).toUpperCase() + userInfo.gender.slice(1) : 'Unknown';
    try {
        const response = await fetch(`${BACKEND_URL}/qamodel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result) {
            const userResponse = new UserResponses({
                user_id: user.id,
                analysis_result:
                    { "Stress Level": parseFloat(result['Stress Level']) },
            });
            await userResponse.save();

            // Create an array of question-answer pairs to ensure data consistency
            const questions = {
                "1": "What is your current Occupation?",
                "2": "Do you have a family history of mental illness?",
                "3": "Have you sought treatment for a mental health condition?",
                "4": "How much time do you spend on Indoor?",
                "5": "Have you experienced any significant changes in your daily habits recently?",
                "6": "Do you have a personal history of mental health issues?",
                "7": "Have you experienced frequent mood swings recently?",
                "8": "Are you currently struggling to cope with stress or difficult situations?",
                "9": "Have you lost interest in your work or daily activities?",
                "10": "Have you noticed difficulties in social interactions or relationships?",
                "11": "Would you bring up a mental health issue with a potential employer in an interview?",
                "12": "Are you aware of the care options available for mental health treatment?"
            };

            const answers = {
                "1": data.Occupation || '',
                "2": data.family_history || '',
                "3": data.treatment || '',
                "4": data.Days_Indoors || '',
                "5": data.Changes_Habits || '',
                "6": data.Mental_Health_History || '',
                "7": data.Mood_Swings || '',
                "8": data.Coping_Struggles || '',
                "9": data.Work_Interest || '',
                "10": data.Social_Weakness || '',
                "11": data.mental_health_interview || '',
                "12": data.care_options || ''
            };
            const newQaAssignment = new qaAssignment({
                user_id: user.id,
                question: questions,
                answer: answers,
            });
            const savedQaAssignment = await newQaAssignment.save();

            // Update progress
            let progress = await Progress.findOne({ user_id: user.id });
            if (!progress) {
                const newProgress = new Progress({
                    user_id: user.id,
                    pending_assignments: process.env.MAX_ASSIGNMENT - 1,
                    next_assignment_date: new Date(Date.now())
                });
                await newProgress.save();
            }
            else {

                if (progress.pending_assignments - 1 > 0) {
                    const updatedProgress = await Progress.findOneAndUpdate(
                        { user_id: user.id },
                        { $set: { pending_assignments: progress.pending_assignments - 1 } },
                        { new: true }
                    );
                    await updatedProgress.save();
                }
                else if (progress.pending_assignments - 1 == 0) {
                    const updatedProgress = await Progress.findOneAndUpdate(
                        { user_id: user.id },
                        { $set: { next_assignment_date: new Date(Date.now() + process.env.ASSIGNMENT_INTERVAL * 1000)>new Date(new Date().setHours(0, 0, 0, 0) + 86400 * 1000)?new Date(new Date().setHours(0, 0, 0, 0) + process.env.ASSIGNMENT_INTERVAL * 1000):new Date(Date.now() + process.env.ASSIGNMENT_INTERVAL * 1000), pending_assignments: process.env.MAX_ASSIGNMENT } },
                        { new: true }
                    );
                    await updatedProgress.save();
                }
            }

            // if (savedQaAssignment) {
            //     // Generate summary for the new QA
            //     const token = cookies().get('wos-session')?.value;
            //     const summaryResponse = await fetch(`${process.env.URL}/api/predict/generatesummary`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Cookie': `wos-session=${token}`
            //         }
            //     });

            //     if (!summaryResponse.ok) {
            //         console.error('Error generating summary:', await summaryResponse.text());
            //     }

            //     const generateQuestionResponse = await fetch(`${process.env.URL}/api/predict/generatequestion`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Cookie': `wos-session=${token}`
            //         }
            //     });

            //     if (!generateQuestionResponse.ok) {
            //         console.error('Error generating question:', await generateQuestionResponse.text());
            //     }
            // }


        }
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }


}