import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	try {
		const token = await getToken({ req });

		console.log('Token:', token);

		const url = new URL(req.url);

		if (!token?.isTwoFactorComplete && url.pathname !== '/factor' && url.pathname !== '/enable') {
			return NextResponse.redirect(new URL('/factor', req.url));
		}

		if (token === null) {
			return NextResponse.redirect(new URL('/signin', req.url));
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
		'/((?!api|_next/static|_next/image|signin|favicon.ico).*)',
	],
};
