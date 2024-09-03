import { Session } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			username: string | undefined;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			isTwoFactorComplete: boolean;
		};
	}
	interface AdapterUser {
		username: string | null;
		name: string;
		email: string;
		image?: string;
		isTwoFactorComplete: boolean;
	}
}
