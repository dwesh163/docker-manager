import type { Metadata } from 'next';
import type { Session } from 'next-auth';
import { Manrope } from 'next/font/google';
import '@/styles/globals.css';
import { SessionProvider } from '@/components/session-provider';
import React from 'react';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Kooked Manager',
	description: 'Manage all your services',
};

type RootLayoutProps = any;

export default function RootLayout(props: RootLayoutProps) {
	const { children, session } = props;
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={manrope.className}>
				<SessionProvider session={session}>{children}</SessionProvider>
			</body>
		</html>
	);
}
