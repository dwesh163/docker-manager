import { Container, Cpu, MemoryStick } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getDockers } from '@/lib/docker';
import DockerTable from '@/components/dockerTable';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';

interface Docker {
	id: string;
	name: string;
	state: string;
	status: string;
	image: string;
	cpuUsage: number;
	memoryUsage: number;
}

interface Stats {
	running: number;
	stopped: number;
	totalCpuUsage: number;
	totalMemoryUsage: number;
}

export default async function DockerPage() {
	const { dockers, stats } = (await getDockers()) as { dockers: Docker[]; stats: Stats };

	const session: Session | null = await getServerSession(authOptions);
	const role = session?.user.role;
	if (session && !role?.includes('admin')) {
		redirect('/');
	}

	const getColor = (value: number) => {
		if (value > 80) {
			return 'text-red-500';
		} else if (value > 70) {
			return 'text-orange-400';
		} else {
			return 'text-green-500';
		}
	};

	return (
		<div className="flex flex-col items-center flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Running Containers</CardTitle>
						<Container className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{stats.running}</div>
						<p className="text-sm text-muted-foreground">+2 since last hour</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Stopped Containers</CardTitle>
						<Container className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{stats.stopped}</div>
						<p className="text-sm text-muted-foreground">-1 since last hour</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">CPU Utilization</CardTitle>
						<Cpu className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className={cn('text-3xl font-bold', getColor(stats.totalCpuUsage))}>{stats.totalCpuUsage.toFixed(2)}%</div>
						<p className="text-sm text-muted-foreground">+5% from last hour</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Memory Usage</CardTitle>
						<MemoryStick className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className={cn('text-3xl font-bold', getColor(stats.totalMemoryUsage))}>{stats.totalMemoryUsage.toFixed(2)} GO</div>
						<p className="text-sm text-muted-foreground">+3% from last hour</p>
					</CardContent>
				</Card>
			</div>
			<DockerTable dockers={dockers} stats={stats} />
		</div>
	);
}
