import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';
import { getNetworks } from '@/lib/network';
import { NetworksCard } from '@/components/networks';

export default async function NetworksPage() {
	const session: Session | null = await getServerSession(authOptions);
	const role = session?.user.role;

	const networks = await getNetworks();

	return (
		<div className="flex flex-col items-center flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<NetworksCard networksData={networks} />
		</div>
	);
}
