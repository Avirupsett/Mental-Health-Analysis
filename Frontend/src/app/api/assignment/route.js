import { NextResponse } from 'next/server';
import Progress from '../../../models/progress';
import QAAssignment from '../../../models/qaAssignment';
import { getUser } from "@workos-inc/authkit-nextjs"

export async function POST(req) {
    try {

        // Get authenticated user session
        const { user } = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let next_assignment_date;
        let latestQAAssignment;
        

        // Check next assignment date from Progress
        const latestProgress = await Progress.findOne({ user_id: user.id });
        if (latestProgress && new Date(latestProgress.next_assignment_date) >= new Date()) {
            next_assignment_date = latestProgress.next_assignment_date
        }
        else {
            next_assignment_date = "false"
        }

        const qaAssignmentsCount = await QAAssignment.exists({ user_id: user.id });
        if (qaAssignmentsCount) {
            // Get latest incomplete QA Assignment
            latestQAAssignment = await QAAssignment.findOne()
            .where({ user_id: user.id, answer: { $size: 0 } })
            .sort({ created_at: -1 });
        }

        return NextResponse.json({
            next_assignment_date,
            latestQAAssignment,
            qaAssignmentsCount
        });

    } catch (error) {
        console.error('Assignment creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
