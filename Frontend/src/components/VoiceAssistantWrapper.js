'use client';

import dynamic from 'next/dynamic';

// Dynamically import VoiceAssistant with no SSR
const VoiceAssistant = dynamic(() => import('./VoiceAssistant'), {
    ssr: false,
});

export default function VoiceAssistantWrapper() {
    return <VoiceAssistant />;
} 