import TwoFactorAuth from '@/components/twoFactorAuth';
import { checkTwoFactorEnabled } from '@/lib/user';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function EnablePage() {
	const session = await getServerSession();
	const isTwoFactorEnabled = await checkTwoFactorEnabled(session as Session);

	if (session === null) {
		redirect('/signin');
	}

	if (!isTwoFactorEnabled) {
		redirect('/enable');
	}

	return <TwoFactorAuth />;
}
