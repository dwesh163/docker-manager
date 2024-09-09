import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { UsersTable } from '@/components/users';
import { getUsers } from '@/lib/user';

export default async function UsersPage() {
	const session: Session | null = await getServerSession(authOptions);
	const role = session?.user.role;
	if (session && !role?.includes('admin')) {
		redirect('/');
	}

	const users = await getUsers(session?.user.email as string);

	return (
		<div className="flex flex-col items-center flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<UsersTable users={users} />
		</div>
	);
}
