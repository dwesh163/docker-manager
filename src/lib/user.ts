import { IUser, User } from '@/models/User';
import { Session } from 'next-auth';

export async function checkTwoFactorEnabled(session: Session): Promise<boolean> {
	const user = await User.findOne<IUser>({ email: session.user.email });

	return user?.twoFactorEnabled || false;
}

export async function getRole(session: Session): Promise<string | null> {
	const user = await User.findOne<IUser>({ email: session.user.email });
	return user?.role || null;
}
