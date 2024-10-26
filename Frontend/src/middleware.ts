import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware(
    {
        middlewareAuth:{
            enabled: true,
             // Allow logged out users to view these paths
            unauthenticatedPaths: ['/', '/demo1.png', '/icons/:path*'],
        }
    }
);

// Don't match on API routes, static files and the favicon
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
