import { NextRequest, NextResponse } from 'next/server';
import { getToken, encode } from 'next-auth/jwt';
import { authenticator } from 'otplib';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/mongo';
import { User } from '@/models/User';
import { symmetricDecrypt } from '@/lib/crypto';

export async function POST(req: NextRequest) {
	const { otp } = await req.json();

	if (!otp) {
		return NextResponse.json({ error: 'TOTP code are required' }, { status: 400 });
	}

	const session: Session | null = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	await db.connect();
	const user = await User.findOne({ email: session.user?.email });

	if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const secret = symmetricDecrypt(user.twoFactorSecret, process.env.NEXTAUTH_ENCRYPTION!);
	const isValidToken = authenticator.check(otp, secret);

	if (!isValidToken) {
		return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 401 });
	}

	// Fetch and update the JWT token
	const token = await getToken({ req });

	if (token) {
		// Update token with 2FA completion status
		token.isTwoFactorComplete = true;
		token.TwoFactorExpiration = new Date(Date.now() + 1000 * 60 * 60 * 4).getTime(); // 8 hours

		// Encode the updated token
		const encodedToken = await encode({
			token,
			secret: process.env.NEXTAUTH_SECRET!,
		});

		// Set the updated JWT token in the response header
		const response = NextResponse.json({ message: '2FA verification successful' }, { status: 200 });
		if (process.env.NODE_ENV !== 'production') {
			response.headers.set('Set-Cookie', `next-auth.session-token=${encodedToken}; Path=/; HttpOnly; Secure; SameSite=Lax;`);
		} else {
			response.headers.set('Set-Cookie', `__Secure-next-auth.session-token=${encodedToken}; Path=/; HttpOnly; Secure; SameSite=Lax;`);
		}

		return response;
	}
	// Fallback in case token retrieval or update fails
	return NextResponse.json({ error: 'Failed to update JWT token' }, { status: 500 });
}
