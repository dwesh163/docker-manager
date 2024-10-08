'use client';
import { ServiceType } from '@/types/service';
import { Camera, CircleAlert, Globe, Pen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { EditServiceForm } from '@/components/forms/editServiceForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DockerType } from '@/types/docker';
import { useRouter, usePathname } from 'next/navigation';
import { CreateDockerForm } from '@/components/forms/createDockerForm';
import moment from 'moment';
import { CreateDomainForm } from './forms/createDomainForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Service({ serializedService }: { serializedService: string }) {
	const service: ServiceType = JSON.parse(serializedService);
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
						{service.repository != null ? (
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
					<TabsTrigger value="domain">Domain</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="secrets">Secrets</TabsTrigger>
					<TabsTrigger value="build">Build</TabsTrigger>
				</TabsList>
				<TabsContent value="dockers" className="sm:h-[520px]">
					<DockerTabs dockers={service.dockers} />
				</TabsContent>
				<TabsContent value="domain" className="sm:h-[520px]">
					<DomainTabs service={service} />
				</TabsContent>
				<TabsContent value="users">Users</TabsContent>
				<TabsContent value="secrets">Secrets</TabsContent>
				<TabsContent value="build">Build</TabsContent>
			</Tabs>
		</Card>
	);
}

const PAGE_SIZE = 5;

function DockerTabs({ dockers }: { dockers: DockerType[] }) {
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
		<Card className="h-full sm:h-[520px] w-full">
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
				<Table className="text-base">
					<TableHeader>
						<TableRow className="hover:bg-card">
							<TableHead className="w-[20%]">Name</TableHead>
							<TableHead className="w-[10%]">Status</TableHead>
							<TableHead className="w-[25%]">Image</TableHead>
							<TableHead className="w-[20%]">Ports</TableHead>
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
								<TableCell className="flex gap-1">
									{d.ports.map((p, index) => (
										<p key={'port' + index}>
											{p.in}
											{p.out ? `:${p.out}` : '/tcp'}
											{index !== d.ports.length - 1 && ','}{' '}
										</p>
									))}
								</TableCell>
								<TableCell>{d.startedAt && <p className="text-muted-foreground">Started {moment(new Date(d.startedAt), 'YYYYMMDD').fromNow()}</p>}</TableCell>
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

function DomainTabs({ service }: { service: ServiceType }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedDocker, setSelectedDocker] = useState<{ [key: string]: string }>({});
	const [selectedPort, setSelectedPort] = useState<{ [key: string]: number | null }>({});

	const router = useRouter();

	const PAGE_SIZE = 10;
	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;

	const paginatedDomains = service.domains.slice(startIndex, endIndex);
	const totalPages = Math.ceil(service.domains.length / PAGE_SIZE);

	// Fill selectedDocker and selectedPort with initial values from the service
	useEffect(() => {
		const dockerSelection: { [key: string]: string } = {};
		const portSelection: { [key: string]: number | null } = {};

		service.domains.forEach((domain) => {
			if (domain.docker) {
				dockerSelection[domain.id] = domain.docker;
			}
			if (domain.port) {
				portSelection[domain.id] = domain.port;
			} else {
				portSelection[domain.id] = null;
			}
		});

		setSelectedDocker(dockerSelection);
		setSelectedPort(portSelection);
	}, [service]);

	// Filter dockers: include unassigned dockers or dockers already selected for the current domain
	const getAvailableDockers = (domainId: string) => {
		return service.dockers.filter((docker) => !service.domains.some((domain) => domain.docker === docker.id && domain.id !== domainId) || docker.id === selectedDocker[domainId]);
	};

	// Handle docker selection and patch the domain
	const handleDockerSelect = (domainId: string, dockerId: string) => {
		console.log('domainId:', domainId);
		console.log('dockerId:', dockerId);
		setSelectedDocker((prev) => ({ ...prev, [domainId]: dockerId }));

		// Auto-select the port if the docker has only one port
		const docker = service.dockers.find((d) => d.id === dockerId);
		if (docker && docker.ports.length === 1) {
			setSelectedPort((prev) => ({ ...prev, [domainId]: docker.ports[0].in }));
			patchDomain(domainId, dockerId, docker.ports[0].in);
		} else {
			patchDomain(domainId, dockerId, null);
		}
	};

	// Handle port selection and patch the domain
	const handlePortSelect = (domainId: string, port: number) => {
		setSelectedPort((prev) => ({ ...prev, [domainId]: port }));
		patchDomain(domainId, selectedDocker[domainId], port);
	};

	// Patch the domain with the selected docker and port
	const patchDomain = async (domainId: string, dockerId: string | null, port: number | null) => {
		try {
			const response = await fetch(`/api/domains/${domainId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ docker: dockerId, port }),
			});

			if (response.ok) {
				router.refresh();
				console.log(`Domain ${domainId} updated with docker ${dockerId} and port ${port}`);
			} else {
				throw new Error('Failed to update domain');
			}
		} catch (error) {
			console.error(`Failed to update domain ${domainId}:`, error);
		}
	};

	// Handle page navigation
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
						<CardDescription>Expose your service to the web with a domain</CardDescription>
					</div>
					<CreateDomainForm serviceId={service.id} />
				</div>
			</CardHeader>
			<CardContent>
				<Table className="text-base">
					<TableHeader>
						<TableRow className="hover:bg-card">
							<TableHead className="w-[20%]">Url</TableHead>
							<TableHead className="w-[10%]">Container</TableHead>
							<TableHead className="w-[10%]">Port</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedDomains.map((domain) => (
							<TableRow key={domain.id} className="font-medium">
								<TableCell>
									{domain.subdomain && domain.subdomain + '.'}
									{domain.domain}
								</TableCell>
								<TableCell>
									<Select onValueChange={(value) => handleDockerSelect(domain.id, value)} value={selectedDocker[domain.id] || ''}>
										<SelectTrigger className="w-[275px]">
											<SelectValue placeholder="Unset" />
										</SelectTrigger>
										<SelectContent>
											{getAvailableDockers(domain.id).map((docker) => (
												<SelectItem key={docker.id} value={docker.id}>
													{docker.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell>
									{selectedDocker[domain.id] && (
										<Select disabled={service.dockers.find((d) => d.id === selectedDocker[domain.id])?.ports.length === 1} onValueChange={(value) => handlePortSelect(domain.id, Number(value))} value={selectedPort[domain.id]?.toString() || ''}>
											<SelectTrigger className="w-[275px]">
												<SelectValue placeholder="Unset" />
											</SelectTrigger>
											<SelectContent>
												{service.dockers
													.find((d) => d.id === selectedDocker[domain.id])
													?.ports.map((port) => (
														<SelectItem key={port.in} value={port.in.toString()}>
															{port.in}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
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
							{startIndex + 1}-{Math.min(endIndex, service.domains.length)}
						</strong>{' '}
						of <strong>{service.domains.length}</strong> Domains
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
