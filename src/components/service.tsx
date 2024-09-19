'use client';
import { ServiceType } from '@/types/service';
import { Camera, CircleAlert, Globe, Pen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { EditServiceForm } from '@/components/forms/editServiceForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DockerType } from '@/types/docker';
import { useRouter, usePathname } from 'next/navigation';
import { CreateDockerForm } from '@/components/forms/createDockerForm';
import moment from 'moment';

export function Service({ service }: { service: ServiceType }) {
	return (
		<Card className="h-full w-full p-12">
			<div className="flex gap-4 w-full">
				<div className="w-[150px] h-[150px] bg-background rounded-lg flex items-center justify-center">
					<Camera size={32} />
				</div>
				<div className="w-[calc(100%-150px-1rem)] mt-1">
					<div className="flex w-full justify-between items-center">
						<div>
							<h3 className="text-3xl font-semibold leading-none tracking-tight">{service.name}</h3>
							<p className="text-base text-muted-foreground">{service.description}</p>
						</div>
						<div className="flex gap-2">
							<EditServiceForm service={service} trigger={<Button variant="outline">Edit</Button>} />
							<Button variant="outline">Deploy</Button>
						</div>
					</div>
					<hr className="my-2 w-1/3" />
					<div>
						<div className="flex gap-2">
							<div className={cn('flex gap-1', service.status === 'running' ? 'text-green-500' : 'text-red-500')}>
								{service.status === 'running' ? <Globe className="h-5 w-5 mt-0.5" /> : <CircleAlert className="h-5 w-5 mt-0.5" />}
								<p className="text-base">{service.status === 'running' ? 'Online' : 'Offline'}</p>
							</div>
							{service.url && <p className="text-base">-</p>}
							<Link href={'http://' + service.url} target="_blank" className="flex gap-1">
								{service.url}
							</Link>
						</div>
					</div>

					<div className="mt-1">
						{service.repository ? (
							<Link href={service?.repository?.url} target="_blank" className="flex gap-1 items-center cursor-pointer">
								{service?.repository?.image !== '' ? <Image src={service?.repository?.image} alt="Repository owner" width={32} height={32} className="rounded-full" /> : <div className="w-8 h-8 bg-background rounded-full" />}
								<p className="text-base font-bold">{service?.repository?.url.replace('https://github.com/', '')}</p>
							</Link>
						) : (
							<EditServiceForm
								service={service}
								trigger={
									<div className="flex gap-1 items-center text-muted-foreground cursor-pointer">
										<Pen className="w-4 h-4" />
										<p className="text-base">Define a repository</p>
									</div>
								}
							/>
						)}
					</div>
				</div>
			</div>
			<Tabs defaultValue="dockers" className="mt-12">
				<TabsList>
					<TabsTrigger value="dockers">Containers</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="secrets">Secrets</TabsTrigger>
					<TabsTrigger value="build">Build</TabsTrigger>
				</TabsList>
				<TabsContent value="dockers">
					<DockerTable dockers={service.dockers} />
				</TabsContent>
				<TabsContent value="users">Users</TabsContent>
				<TabsContent value="secrets">Secrets</TabsContent>
				<TabsContent value="build">Build</TabsContent>
			</Tabs>
		</Card>
	);
}

const PAGE_SIZE = 5;

function DockerTable({ dockers }: { dockers: DockerType[] }) {
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;
	const router = useRouter();
	const pathname = usePathname();
	const ServiceId = pathname.split('/')[2];

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
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Containers</CardTitle>
						<CardDescription>Manage and monitor your Docker containers.</CardDescription>
					</div>
					<CreateDockerForm ServiceId={ServiceId} />
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-card">
							<TableHead className="w-[15%]">Name</TableHead>
							<TableHead className="w-[20%]">Status</TableHead>
							<TableHead className="w-[30%]">Image</TableHead>
							<TableHead>Started</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedDockers.map((d, index) => (
							<TableRow key={'docker' + index}>
								<TableCell className="font-medium">{d.name}</TableCell>
								<TableCell>
									<Badge className={cn(d.status == 'running' && 'bg-green-500 hover:bg-green-600', d.status == 'starting' && 'bg-orange-500 hover:bg-orange-600', d.status == 'failed' && 'bg-red-500 hover:bg-red-600', 'text-white select-none w-20 flex justify-center text-center')} variant={d.status == 'running' ? 'secondary' : 'outline'}>
										{d.status}
									</Badge>
								</TableCell>
								<TableCell>{d.image}</TableCell>
								<TableCell>{d.startedAt && <p className="text-xs text-muted-foreground">Started {moment(new Date(d.startedAt), 'YYYYMMDD').fromNow()}</p>}</TableCell>
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
