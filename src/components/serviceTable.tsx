'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { MoveHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ServicesType } from '@/types/service';
import { CreateServiceForm } from '@/components/forms/CreateServiceForm';

const PAGE_SIZE = 5;

export function ServiceTable({ services }: { services: ServicesType[] }) {
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;
	const router = useRouter();

	const paginatedServices = services.slice(startIndex, endIndex);

	const totalPages = Math.ceil(services.length / PAGE_SIZE);

	const goToPage = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return (
		<Card className="h-full w-full">
			<CardHeader className="px-7">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Services</CardTitle>
						<CardDescription className="mt-1">Manage and monitor your Services.</CardDescription>
					</div>
					<CreateServiceForm />
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-card">
							<TableHead className="w-[15%]">Name</TableHead>
							<TableHead className="w-[70%]">Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedServices.map((s) => (
							<TableRow key={s.id}>
								<TableCell className="font-medium">{s.name}</TableCell>
								<TableCell>
									<Badge variant={s.status === 'running' ? 'secondary' : 'outline'}>{s.status}</Badge>
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
							{startIndex + 1}-{Math.min(endIndex, services.length)}
						</strong>{' '}
						of <strong>{services.length}</strong> containers
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
