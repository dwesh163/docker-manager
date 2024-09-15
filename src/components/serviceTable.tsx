'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { CircleAlert, Globe, MoveHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ServicesType } from '@/types/service';
import { CreateServiceForm } from '@/components/forms/createServiceForm';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

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
							<TableHead className="w-[20%]">Status</TableHead>
							<TableHead className="w-[50%]">Repository</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedServices.map((s) => (
							<TableRow key={s.id} className="cursor-pointer" onClick={() => router.push(`/services/${s.id}`)}>
								<TableCell className="font-medium">{s.name}</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<div className={cn('flex gap-1', s.status === 'running' ? 'text-green-500' : 'text-red-500')}>
											{s.status === 'running' ? <Globe className="h-5 w-5 mt-0.5" /> : <CircleAlert className="h-5 w-5 mt-0.5" />}
											<p className="text-base">{s.status === 'running' ? 'Online' : 'Offline'}</p>
										</div>
										{s.url && <p className="text-base">-</p>}
										<Link href={'http://' + s.url} target="_blank" className="flex gap-1">
											{s.url}
										</Link>
									</div>
								</TableCell>
								<TableCell>
									{s.repository && (
										<div className="flex gap-2 items-center cursor-pointer">
											{s?.repository?.image ? <Image src={s?.repository?.image} alt="Repository owner" width={32} height={32} className="rounded-full" /> : <div className="w-8 h-8 bg-background rounded-full" />}
											<p className="text-base">{s?.repository?.url.replace('https://github.com/', '')}</p>
										</div>
									)}
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
