import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { UserDropdown } from './user-dropdown';
import { Input } from '@/components/ui/input';

export default function Navbar({ session }: { session: Session }) {
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
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Docker</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="flex items-center gap-4">
				<div className="relative flex-1 md:grow-0">
					<div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" />
				</div>
				<UserDropdown session={session} />
			</div>
		</header>
	);
}
