import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Container, Cpu, MemoryStick } from 'lucide-react';

export default function Loading() {
	return (
		<div className="flex flex-col items-center flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Running Containers</CardTitle>
						<Container className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-6 w-24 mt-2" />
						<Skeleton className="h-4 w-20 mt-2" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Stopped Containers</CardTitle>
						<Container className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-6 w-24 mt-2" />
						<Skeleton className="h-4 w-20 mt-2" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">CPU Utilization</CardTitle>
						<Cpu className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-6 w-24 mt-2" />
						<Skeleton className="h-4 w-20 mt-2" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Memory Usage</CardTitle>
						<MemoryStick className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-6 w-24 mt-2" />
						<Skeleton className="h-4 w-20 mt-2" />
					</CardContent>
				</Card>
			</div>

			<Card className="h-full w-full">
				<CardHeader className="px-7">
					<CardTitle>Containers</CardTitle>
					<CardDescription>Manage and monitor your Docker containers.</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[15%]">Name</TableHead>
								<TableHead className="w-[20%]">Status</TableHead>
								<TableHead className="w-[30%]">Image</TableHead>
								<TableHead>CPU</TableHead>
								<TableHead>Memory</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[...Array(5)].map((_, i) => (
								<TableRow key={i} className="h-[73px]">
									<TableCell>
										<Skeleton className="h-4 w-24" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-20" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-32" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-16" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-16" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-8 w-8" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter>
					<Skeleton className="h-4 my-4 w-full" />
				</CardFooter>
			</Card>
		</div>
	);
}
