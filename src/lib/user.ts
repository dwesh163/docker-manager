import { IUser, User } from '@/models/User';
import { Session } from 'next-auth';
import db from './mongo';
import { User as UserType } from '@/types/user';

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

export async function getUsers(email: string): Promise<UserType[]> {
	await db.connect();

	const role = await getRole(email);

	if (!role.includes('admin')) {
		return [];
	}

	const users = await User.find<IUser>();

	return users.map((user) => {
		return {
			id: user.id as number,
			username: user.username as string,
			name: user.name as string,
			email: user.email as string,
			image: user.image as string,
			role: user.role as string,
			isTwoFactorComplete: user.twoFactorEnabled as boolean,
		};
	});
}

export async function checkUserAccess(session: Session, url: string): Promise<boolean> {
	await db.connect();

	const user = await User.findOne<IUser>({ email: session.user.email });

	if (!user) {
		return false;
	}

	return user?.role.includes('admin') || false;
}
