import { IUser, User } from '@/models/User';
import { Session } from 'next-auth';
import db from './mongo';

export async function checkTwoFactorEnabled(session: Session): Promise<boolean> {
	await db.connect();

	const user = await User.findOne<IUser>({ email: session.user.email });

	return user?.twoFactorEnabled || false;
}

export async function getRole(email: string): Promise<string> {
	await db.connect();

	if (!email) {
		return 'denied';
	}

	const user = await User.findOne<IUser>({ email: email });
	return user?.role || 'denied';
}
