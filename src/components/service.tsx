'use client';
import { ServiceType } from '@/types/service';
import { Card } from '@/components/ui/card';
import { Camera, CircleAlert, Globe, Pen } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { EditServiceForm } from '@/components/forms/editServiceForm';

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
		</Card>
	);
}
