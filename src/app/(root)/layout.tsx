import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getServerSession } from 'next-auth';

export default async function RootLayout({ children }: { children: ReactNode }) {
	const session = await getServerSession();

	return (
		<main className="flex">
			{JSON.stringify(session)}
			{children}
		</main>
	);
}
