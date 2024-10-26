export default function manifest() {
    return {
        name: "Mentrix - Mental Health Monitoring System",
        short_name: "Mentrix",
        description: "Professional mental health monitoring system offering personalized assessments, real-time feedback, and progress tracking.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        dir: "ltr",
        lang: "en-US",
        categories: ["health", "medical", "lifestyle"],
        scope: "/",
        icons: [
            {
                src: `${process.env.URL}/icons/android-chrome-192x192.png`,
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: `${process.env.URL}/icons/android-chrome-512x512.png`,
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: `${process.env.URL}/icons/favicon-16x16.png`,
                sizes: "16x16",
                type: "image/png",
            },
            {
                src: `${process.env.URL}/icons/favicon-32x32.png`,
                sizes: "32x32",
                type: "image/png",
            }
        ],
        shortcuts: [
            {
                name: "Take Assessment",
                short_name: "Assessment",
                description: "Start your daily mental health assessment",
                url: `${process.env.URL}/portal/assignment`,
            },
            {
                name: "View Dashboard",
                short_name: "Dashboard",
                description: "Check your mental health progress",
                url: `${process.env.URL}/portal/dashboard`,
            }
        ],
    }
}