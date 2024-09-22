'use server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDomains } from '@/lib/domain';
import { DomainTable } from '@/components/domainTable';

export default async function DomainPage() {
	const session: Session | null = await getServerSession(authOptions);
	const domains = await getDomains(session?.user.email);

	return (
		<div className="flex flex-col items-center flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<DomainTable domains={domains} />
		</div>
	);
}
