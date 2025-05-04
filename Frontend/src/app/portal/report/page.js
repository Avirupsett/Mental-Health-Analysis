import { ReportGenerator } from "../../../components/Portal/Report/ReportGenerator";
import { cookies } from 'next/headers'

export default async function Report() {
    const cookieStore = cookies();
    const token = cookieStore.get('wos-session')?.value;
    async function getPatientInfo() {
        const response = await fetch(`${process.env.URL}/api/profile/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `wos-session=${token}`
            }
        });
        const data = await response.json();
        return data;
    }


    const patientInfo = await getPatientInfo() || [];

    return <ReportGenerator patientInfo={patientInfo}/>;
}