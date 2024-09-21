'use server';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ServicesType } from '@/types/service';
import { getServices } from '@/lib/service';
import { CircleAlert, MoveVertical, Server } from 'lucide-react';

export default async function HomePage() {
	const session: Session | null = await getServerSession(authOptions);
	const services = await getServices(session?.user.email);
	const stats = {
		active: services.reduce((acc, service) => (service.status === 'active' ? acc + 1 : acc), 0),
		inactive: services.reduce((acc, service) => (service.status === 'inactive' ? acc + 1 : acc), 0),
	};

	return (
		<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full">
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Services</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<span className="text-4xl font-bold">{stats.active}</span>
								<span className="text-muted-foreground"> running</span>
							</div>
							<Server className="h-8 w-8" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Down Services</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<span className="text-4xl font-bold text-red-500">{stats.inactive}</span>
								<span className="text-muted-foreground"> down</span>
							</div>
							<CircleAlert className="h-8 w-8 text-red-500" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Virtual Machine</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<span className="text-4xl font-bold text-green-500">Running</span>
							</div>
							<Server className="h-8 w-8 text-green-500" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
