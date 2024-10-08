import { ReactNode } from 'react';
import React from 'react';
import { getServerSession } from 'next-auth';
import Sidebar from '@/components/sidebar';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import { getRole } from '@/lib/user';

export default async function RootLayout({ children }: { children: ReactNode }) {
	const session = await getServerSession();

	if (!session) {
		redirect('/signin');
	}

	const role = await getRole(session?.user.email as string);

	if (role === 'denied') {
		redirect('/signin');
	}

	return (
		<div className="flex h-screen">
			<Sidebar session={session} role={role} />
			<main className="bg-muted/40 w-full">
				<Navbar session={session} />
				{children}
			</main>
		</div>
	);
}
