import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { IUser, User } from '@/models/User';
import { symmetricEncrypt } from '@/lib/crypto';
import { NextResponse } from 'next/server';
import db from '@/lib/mongo';

export async function POST() {
	const session = await getServerSession(authOptions);

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

	if (!process.env.NEXTAUTH_ENCRYPTION) {
		console.error('Missing encryption key; cannot proceed with two factor setup.');
		return NextResponse.json({ error: 'Missing encryption key; cannot proceed with two factor setup.' }, { status: 500 });
	}

	// This generates a secret 32 characters in length. Do not modify the number of
	// bytes without updating the sanity checks in the enable and login endpoints.
	const secret = authenticator.generateSecret(20);

	await User.updateOne(
		{ email: session.user?.email },
		{
			twoFactorEnabled: false,
			twoFactorSecret: symmetricEncrypt(secret, process.env.NEXTAUTH_ENCRYPTION),
		}
	);

	const name = user.email;
	const keyUri = authenticator.keyuri(name, 'Kooked Manager', secret);
	const QRUri = await qrcode.toDataURL(keyUri);

	return NextResponse.json({ secret, keyUri, QRUri });
}
