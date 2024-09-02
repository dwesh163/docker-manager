import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });

	if (!token?.is2FACompleted && req.nextUrl.pathname !== '/enable') {
		return NextResponse.redirect(new URL('/enable', req.url));
	}

	return NextResponse.next();
}
