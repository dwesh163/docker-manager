import { getToken, encode } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Centralized Authentication Options
const authOptions = {
	secret: process.env.NEXTAUTH_SECRET!,
	cookieName: process.env.NODE_ENV !== 'production' ? 'next-auth.session-token' : '__Secure-next-auth.session-token',
};

// Create a withAuth Wrapper for Middleware
export function withAuth(middleware: Function, options: Partial<typeof authOptions> = {}) {
	return async (req: NextRequest) => {
		// Merge default auth options with provided subset
		const finalAuthOptions = { ...authOptions, ...options };

		try {
			// Perform token validation as part of the auth logic
			const token = await getToken({ req, secret: finalAuthOptions.secret });

			// Continue with the original middleware logic
			return await middleware(req, token, finalAuthOptions);
		} catch (error) {
			console.error('Authentication failed:', error);
			// Redirect to sign-in page in case of error
			return NextResponse.redirect(new URL('/signin', req.url));
		}
	};
}

// Original Middleware Logic with Token Passed as Argument
type AuthOptions = typeof authOptions;

async function myMiddleware(req: NextRequest, token: any, authOptions: any) {
	const url = new URL(req.url);

	// Redirect to sign-in page if the user is not authenticated
	if (token === null && url.pathname !== '/signin') {
		return NextResponse.redirect(new URL('/signin', req.url));
	}

	// Check if the 2FA has expired
	if (token?.isTwoFactorComplete && token?.TwoFactorExpiration && (token.TwoFactorExpiration as number) < Date.now()) {
		token.isTwoFactorComplete = false;
		token.TwoFactorExpiration = null;

		const encodedToken = await encode({
			token,
			secret: authOptions.secret,
		});

		const response = NextResponse.redirect(new URL('/', req.url));

		// Set the correct session token cookie
		response.headers.set('Set-Cookie', `${authOptions.cookieName}=${encodedToken}; Path=/; HttpOnly; Secure; SameSite=Lax;`);

		return response;
	}

	// Redirect to /factor if 2FA is not complete
	if (token !== null && !token?.isTwoFactorComplete && url.pathname !== '/factor' && url.pathname !== '/enable') {
		return NextResponse.redirect(new URL('/factor', req.url));
	}

	// Continue with the next handler if authenticated and 2FA complete
	return NextResponse.next();
}

// Use the withAuth Wrapper to Apply Auth to Middleware
export const middleware = withAuth(myMiddleware, {
	// Optionally override some authOptions (e.g., different secret or cookie)
	secret: process.env.CUSTOM_SECRET ?? process.env.NEXTAUTH_SECRET!,
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
