import { Session } from 'next-auth';
import Image from 'next/image';
import { UserDropdown } from './user-dropdown';
import { Input } from '@/components/ui/input';

export default function Navbar({ session }: { session: Session }) {
	return (
		<header className="w-full flex justify-end p-4 px-6">
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
