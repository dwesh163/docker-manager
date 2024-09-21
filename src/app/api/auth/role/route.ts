import { NextRequest, NextResponse } from 'next/server';
import { getToken, encode } from 'next-auth/jwt';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/mongo';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
	const session: Session | null = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	await db.connect();
	const user = await User.findOne({ email: session.user?.email });

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (user.role === 'denied') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const token = await getToken({ req });

	if (token) {
		token.role = user.role;

		const encodedToken = await encode({
			token,
			secret: process.env.NEXTAUTH_SECRET!,
		});

		const response = NextResponse.json({ message: 'ok' }, { status: 200 });
		if (process.env.NODE_ENV !== 'production') {
			response.headers.set('Set-Cookie', `next-auth.session-token=${encodedToken}; Path=/; HttpOnly; Secure; SameSite=Lax;`);
		} else {
			response.headers.set('Set-Cookie', `__Secure-next-auth.session-token=${encodedToken}; Path=/; HttpOnly; Secure; SameSite=Lax;`);
		}

		return response;
	}
	return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
}
