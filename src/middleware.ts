import { encode, getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	try {
		const token = await getToken({ req });

		console.log('token', token);

		const url = new URL(req.url);

		if (token === null && url.pathname !== '/signin') {
			return NextResponse.redirect(new URL('/signin', req.url));
		}

		if (token?.isTwoFactorComplete && token?.TwoFactorExpiration && (token.TwoFactorExpiration as number) < Date.now()) {
			token.isTwoFactorComplete = false;
			token.TwoFactorExpiration = null;
			console.log('token2', token);
			const encodedToken = await encode({
				token,
				secret: process.env.NEXTAUTH_SECRET!,
			});
			const response = NextResponse.redirect(new URL('/', req.url));
			console.log('env', process.env.NODE_ENV);
			if (process.env.NODE_ENV !== 'production') {
				response.headers.set('Set-Cookie', `next-auth.session-token=${encodedToken}; Path=/; HttpOnly; Secure; SameSite=Lax;`);
			} else {
				console.log('prod');
				response.headers.set('Set-Cookie', `__Secure-next-auth.session-token=${encodedToken}; Path=/; HttpOnly; Secure; SameSite=Lax;`);
			}
			return response;
		}

		if (token !== null && !token?.isTwoFactorComplete && url.pathname !== '/factor' && url.pathname !== '/enable') {
			return NextResponse.redirect(new URL('/factor', req.url));
		}

		return NextResponse.next();
	} catch (error) {
		return NextResponse.redirect(new URL('/signin', req.url));
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|factor|favicon.ico).*)',
	],
};
