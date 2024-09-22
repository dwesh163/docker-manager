'use server';
import { Container, Cpu, MemoryStick } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getServices } from '@/lib/service';
import { ServiceTable } from '@/components/serviceTable';

export default async function ServicesPage() {
	const session: Session | null = await getServerSession(authOptions);
	const services = await getServices(session?.user.email);
	const stats = {
		running: services.reduce((acc, service) => (service.status === 'running' ? acc + 1 : acc), 0),
		down: services.reduce((acc, service) => (service.status === 'down' ? acc + 1 : acc), 0),
	};

	return (
		<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Running Services</CardTitle>
						<Container className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{stats.running}</div>
						<p className="text-sm text-muted-foreground">+2 since last hour</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Down Services</CardTitle>
						<Container className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className={cn('text-3xl font-bold', stats.down > 0 && 'text-red-500')}>{stats.down}</div>
						<p className="text-sm text-muted-foreground">-1 since last hour</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">CPU Utilization</CardTitle>
						<Cpu className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">%</div>
						<p className="text-sm text-muted-foreground">+5% from last hour</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Memory Usage</CardTitle>
						<MemoryStick className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">%</div>
						<p className="text-sm text-muted-foreground">+3% from last hour</p>
					</CardContent>
				</Card>
			</div>
			<ServiceTable services={services} />
		</div>
	);
}
