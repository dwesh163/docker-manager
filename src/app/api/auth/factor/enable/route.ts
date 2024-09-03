import { authenticator } from 'otplib';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { IUser, User } from '@/models/User';
import { symmetricDecrypt, symmetricEncrypt } from '@/lib/crypto';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/mongo';
import { Session } from 'next-auth';

export async function POST(req: NextRequest) {
	const session: Session | null = await getServerSession(authOptions);

	console.log('session', session);

	if (!session) {
		return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
	}

	if (!session.user?.email) {
		console.error('Session is missing a user email.');
		return NextResponse.json({ error: 'Session is missing a user email.' }, { status: 500 });
	}

	await db.connect();

	console.log('session.user?.email', session.user?.email);

	const user = await User.findOne<IUser>({ email: session.user?.email });

	console.log('user', user);

	if (!user) {
		console.error(`Session references user that no longer exists.`);
		return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
	}

	if (user.twoFactorEnabled) {
		return NextResponse.json({ error: 'Two-factor authentication already activated' }, { status: 400 });
	}

	if (!user.twoFactorSecret) {
		console.error('Missing two factor secret; cannot proceed with two factor setup.');
		return NextResponse.json({ error: 'Missing two factor secret; cannot proceed with two factor setup.' }, { status: 500 });
	}

	if (!process.env.NEXTAUTH_ENCRYPTION) {
		console.error('Missing encryption key; cannot proceed with two factor setup.');
		return NextResponse.json({ error: 'Missing encryption key; cannot proceed with two factor setup.' }, { status: 500 });
	}

	const secret = symmetricDecrypt(user.twoFactorSecret, process.env.NEXTAUTH_ENCRYPTION);
	if (secret.length !== 32) {
		console.error(`Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`);
		return NextResponse.json({ error: 'Two factor secret decryption failed.' }, { status: 500 });
	}

	const { otp } = await req.json();

	console.log('otp', otp);

	const isValidToken = authenticator.check(otp, secret);
	if (!isValidToken) {
		return NextResponse.json({ error: 'Invalid two factor otp.' }, { status: 400 });
	}

	await User.updateOne(
		{ email: session.user?.email },
		{
			twoFactorEnabled: true,
		}
	);

	return NextResponse.json({ message: 'Two-factor enabled' });
}
