'use client';
import Link from 'next/link';
import { House, Server, Network, Globe, Settings, Users, Activity, KeyRound, Database, Container, Drill } from 'lucide-react';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Sidebar({ session, role }: { session: Session; role: string }) {
	const pathname = usePathname();

	return (
		<aside className="flex w-1/5 min-w-[250px] flex-col border-r bg-background h-full">
			<nav className="flex flex-col items-start gap-4 px-6 py-5">
				<Link href="/" className="w-full ">
					<h1 className="text-2xl font-black">Kooked Manager</h1>
				</Link>
				<h3 className="text-lg font-medium text-muted-foreground">Main</h3>
				<div className="grid gap-2 text-xl font-medium -mt-3">
					<Link href="/" className={cn('flex items-center gap-4 px-2.5', pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
						<House className="h-5 w-5" />
						Overview
					</Link>
					<Link href="/services" className={cn('flex items-center gap-4 px-2.5', pathname === '/services' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
						<Server className="h-5 w-5" />
						Services
					</Link>
					<Link href="/network" className={cn('flex items-center gap-4 px-2.5', pathname === '/network' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
						<Network className="h-5 w-5" />
						Network
					</Link>
					<Link href="/domain" className={cn('flex items-center gap-4 px-2.5', pathname === '/domain' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
						<Globe className="h-5 w-5" />
						Domain
					</Link>
					<Link href="/monitoring" className={cn('flex items-center gap-4 px-2.5', pathname === '/monitoring' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
						<Activity className="h-5 w-5" />
						Monitoring
					</Link>
					<Link href="/backup" className={cn('flex items-center gap-4 px-2.5', pathname === '/backup' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
						<Database className="h-5 w-5" />
						Backup
					</Link>
				</div>
				<h3 className="text-lg font-medium text-muted-foreground">Admin</h3>
				<div className="grid gap-2 text-xl font-medium -mt-3">
					{role?.includes('admin') && (
						<>
							<Link href="/secrets" className={cn('flex items-center gap-4 px-2.5', pathname === '/secrets' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
								<KeyRound className="h-5 w-5" />
								Secrets
							</Link>
							<Link href="/settings" className={cn('flex items-center gap-4 px-2.5', pathname === '/settings' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
								<Settings className="h-5 w-5" />
								Settings
							</Link>
							<Link href="/docker" className={cn('flex items-center gap-4 px-2.5', pathname === '/docker' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
								<Container className="h-5 w-5" />
								Docker
							</Link>
							<Link href="/builds" className={cn('flex items-center gap-4 px-2.5', pathname === '/builds' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
								<Drill className="h-5 w-5" />
								Builds
							</Link>
							<Link href="/users" className={cn('flex items-center gap-4 px-2.5', pathname === '/users' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} prefetch={false}>
								<Users className="h-5 w-5" />
								Users
							</Link>
						</>
					)}
				</div>
			</nav>
		</aside>
	);
}
