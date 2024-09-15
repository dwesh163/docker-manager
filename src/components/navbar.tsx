'use client';
import React from 'react';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { UserDropdown } from './user-dropdown';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Navbar({ session }: { session: Session }) {
	const pathname = usePathname();
	const pathSegments = pathname.split('/').filter((segment) => segment);

	return (
		<header className="w-full flex justify-between p-4 px-6">
			<Breadcrumb className="hidden md:flex">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/" prefetch={false}>
								Dashboard
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{pathSegments.length > 0 && <BreadcrumbSeparator />}
					{pathSegments.map((segment, index) => {
						const href = '/' + pathSegments.slice(0, index + 1).join('/');
						const isLast = index === pathSegments.length - 1;

						return (
							<React.Fragment key={'Bread' + index}>
								<BreadcrumbItem>
									{!isLast ? (
										<BreadcrumbLink asChild>
											<Link href={href} prefetch={false}>
												{segment.charAt(0).toUpperCase() + segment.slice(1)}
											</Link>
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage>{segment.charAt(0).toUpperCase() + segment.slice(1)}</BreadcrumbPage>
									)}
								</BreadcrumbItem>
								{!isLast && <BreadcrumbSeparator />}
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
			<div className="flex items-center gap-4">
				<div className="relative flex-1 md:grow-0">
					<div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" />
				</div>
				<UserDropdown session={session} />
			</div>
		</header>
	);
}
