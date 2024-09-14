'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoveHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 5;

export default function DockerTable({ dockers, stats }: { dockers: any[]; stats: any }) {
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;
	const router = useRouter();

	const paginatedDockers = dockers.slice(startIndex, endIndex);

	const totalPages = Math.ceil(dockers.length / PAGE_SIZE);

	const goToPage = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return (
		<Card className="h-full w-full">
			<CardHeader className="px-7">
				<CardTitle>Containers</CardTitle>
				<CardDescription>Manage and monitor your Docker containers.</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-card">
							<TableHead className="w-[15%]">Name</TableHead>
							<TableHead className="w-[20%]">Status</TableHead>
							<TableHead className="w-[30%]">Image</TableHead>
							<TableHead>CPU</TableHead>
							<TableHead>Memory</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedDockers.map((d) => (
							<TableRow key={d.id}>
								<TableCell className="font-medium">{d.name}</TableCell>
								<TableCell>
									<Badge variant={d.status.includes('Up') ? 'secondary' : 'outline'}>{d.status}</Badge>
								</TableCell>
								<TableCell>{d.image}</TableCell>
								<TableCell>
									<Progress value={(d.cpuUsage / stats.totalCpuUsage) * 100 || 0} aria-label={`${d.cpuUsage || 0}% CPU usage`} />
								</TableCell>
								<TableCell>
									<Progress value={(d.memoryUsage / stats.totalMemoryUsage) * 100 || 0} aria-label={`${d.memoryUsage || 0}% memory usage`} />
								</TableCell>

								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button aria-haspopup="true" size="icon" variant="ghost">
												<MoveHorizontal className="h-4 w-4" />
												<span className="sr-only">Toggle menu</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>Start</DropdownMenuItem>
											<DropdownMenuItem>Stop</DropdownMenuItem>
											<DropdownMenuItem>Restart</DropdownMenuItem>
											<DropdownMenuItem>Logs</DropdownMenuItem>
											<DropdownMenuItem>Inspect</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="flex justify-between w-full items-center">
					<div className="text-xs text-muted-foreground">
						Showing{' '}
						<strong>
							{startIndex + 1}-{Math.min(endIndex, dockers.length)}
						</strong>{' '}
						of <strong>{dockers.length}</strong> containers
					</div>
					<div className="flex space-x-2">
						<Button variant="outline" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
							Previous
						</Button>
						<Button variant="outline" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
							Next
						</Button>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
