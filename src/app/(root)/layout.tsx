import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getServerSession } from 'next-auth';
import Sidebar from '@/components/sidebar';
import { redirect } from 'next/navigation';

export default async function RootLayout({ children }: { children: ReactNode }) {
	const session = await getServerSession();

	if (!session) {
		redirect('/signin');
	}

	return (
		<>
			<main className="flex">
				<Sidebar session={session} />
				{children}
			</main>
		</>
	);
}
