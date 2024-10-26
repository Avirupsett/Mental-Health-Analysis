export default async function sitemap() {
    return [
      {
        url: 'https://mentrix-app.vercel.app',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: 'https://mentrix-app.vercel.app/portal/assignment',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: 'https://mentrix-app.vercel.app/portal/dashboard',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://mentrix-app.vercel.app/portal/feedback',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]
  }