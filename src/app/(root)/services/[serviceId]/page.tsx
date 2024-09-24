'use server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getService } from '@/lib/service';
import { Service } from '@/components/service';

export default async function ServicePage({ params }: { params: { serviceId: string } }) {
	const session: Session | null = await getServerSession(authOptions);
	const service = await getService(session?.user.email, params.serviceId);

	return (
		<div className="flex flex-col items-center flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full">
			{service ? (
				<Service serializedService={JSON.stringify(service)} />
			) : (
				<div className="flex justify-center items-center gap-4 w-full h-[calc(100vh-80px)]">
					<p>Service not found</p>
				</div>
			)}
		</div>
	);
}
