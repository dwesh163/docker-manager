import NextAuth, { AdapterUser, NextAuthOptions, User as AuthUser, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { IUser, User } from '@/models/User';
import db from '@/lib/mongo';
import { isPasswordValid } from '@/lib/hash';
import { JWT } from 'next-auth/jwt';

// Define NextAuth options
export const authOptions: NextAuthOptions = {
	pages: {
		signIn: '/signin',
		verifyRequest: '/signin',
	},
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				email: { label: 'Email Address', type: 'email', placeholder: 'name.lastname@example.com' },
				password: { label: 'Password', type: 'password', placeholder: 'Your password' },
			},
			async authorize(credentials: any) {
				await db.connect();

				const user = await User.findOne<IUser>({ email: credentials.email });

				if (!user) {
					return null;
				}

				const isPasswordMatch = await isPasswordValid(credentials.password, user.password as string);

				if (!isPasswordMatch) {
					return null;
				}

				return {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					isTwoFactorComplete: false,
				};
			},
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID || '',
			clientSecret: process.env.GITHUB_SECRET || '',
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID || '',
			clientSecret: process.env.GOOGLE_SECRET || '',
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 7 * 24 * 60 * 60, // 7 Days
	},
	callbacks: {
		async jwt({ token, user, account }: { token: any; user: AuthUser | AdapterUser; account: any }) {
			if (user) {
				token.isTwoFactorComplete = (user as AdapterUser).isTwoFactorComplete || false;
			}

			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			const user = await User.findOne<IUser>({ email: session.user.email });

			if (!user) {
				return session;
			}

			session.user = {
				...session.user,
				role: user.role,
				isTwoFactorComplete: (token.isTwoFactorComplete as boolean) || false,
			};
			return session;
		},
		async signIn({ user, account, profile }) {
			await db.connect();
			const dbUser = await User.findOne<IUser>({ email: user.email });
			const provider = account?.provider || 'credentials';

			if (!dbUser) {
				const newUser = new User({
					email: user.email,
					username: profile?.name || (profile as any)?.login || null,
					image: user.image || profile?.image || null,
					provider: provider,
					name: profile?.name || user.name,
					verified: provider === 'google' || provider === 'github' ? 2 : 1,
				});
				await newUser.save();
			}

			return true;
		},
		async redirect({ url, baseUrl }) {
			console.log(url, baseUrl);
			return process.env.NEXTAUTH_URL || baseUrl;
		},
	},
};

export default NextAuth(authOptions);
