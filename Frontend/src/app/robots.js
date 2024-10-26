export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      sitemap: 'https://mentrix-app.vercel.app/sitemap.xml',
    }
  }