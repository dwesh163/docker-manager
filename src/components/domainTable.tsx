'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ServicesType } from '@/types/service';
import { CreateDomainForm } from '@/components/forms/createDomainForm';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { DomainsType } from '@/types/domain';

const PAGE_SIZE = 5;

export function DomainTable({ domains }: { domains: DomainsType[] }) {
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;
	const router = useRouter();

	const paginatedServices = domains.slice(startIndex, endIndex);

	const totalPages = Math.ceil(domains.length / PAGE_SIZE);

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
						<CardTitle>Domain</CardTitle>
						<CardDescription className="mt-1">Manage and monitor your Domains.</CardDescription>
					</div>
					<CreateDomainForm />
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-card">
							<TableHead className="w-[15%]">Url</TableHead>
							<TableHead className="w-[20%]">Service</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedServices.map((d) => (
							<TableRow key={d.id} className="cursor-pointer">
								<TableCell className="font-medium flex items-center">
									<Globe className="h-4 w-4 mr-1" />
									{d.subdomain && `${d.subdomain}.`}
									{d.domain}
								</TableCell>
								<TableCell>
									{d.service && (
										<Link href={`/services/${d.id}`}>
											<p className={cn('text-sm font-medium', 'hover:underline')}>{d.service.name}</p>
										</Link>
									)}
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
							{startIndex + 1}-{Math.min(endIndex, domains.length)}
						</strong>{' '}
						of <strong>{domains.length}</strong> domains
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
