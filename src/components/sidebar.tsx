import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Link from 'next/link';
import { House, Server, Network, World, Settings, Users } from 'lucide-react';
import { Session } from 'next-auth';

export default function Sidebar({ session }: { session: Session }) {
	return (
		<aside className="flex w-1/5 flex-col border-r bg-background">
			<nav className="flex flex-col items-start gap-4 px-6 py-5">
				<TooltipProvider>
					<Link href="/" className="w-ful">
						<h1 className="text-3xl font-black">Kooked Manager</h1>
					</Link>
					<div className="grid gap-2 text-lg font-medium">
						<Link href="/" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
							<House className="h-5 w-5" />
							Overview
						</Link>
						<Link href="/services" className="flex items-center gap-4 px-2.5 text-foreground" prefetch={false}>
							<Server className="h-5 w-5" />
							Services
						</Link>
						<Link href="/network" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
							<Network className="h-5 w-5" />
							Network
						</Link>
						<Link href="/domain" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
							<World className="h-5 w-5" />
							Domain
						</Link>
						{session.user?.role === 'superAdmin' && (
							<Link href="/users" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
								<Users className="h-5 w-5" />
								Users
							</Link>
						)}
					</div>
				</TooltipProvider>
			</nav>
			<nav className="mt-auto flex flex-col items-start gap-4 px-6 py-5">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link href="/Setting" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" prefetch={false}>
								<Settings className="h-5 w-5" />
								<span className="sr-only">Settings</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Settings</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</nav>
		</aside>
	);
}
