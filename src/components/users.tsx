'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { User } from '@/types/user';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

export function UsersTable({ usersData }: { usersData: User[] }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [users, setUsers] = useState<User[]>(usersData);
	const [openPopover, setOpenPopover] = useState<number | null>(null);
	const [accred, setAccred] = useState<Record<string, { name: string; description: string }>>({
		superadmin: { name: 'Super Admin', description: 'Can view, edit, manage, and delete' },
		admin: { name: 'Admin', description: "Email isn't verified, state is unmodifiable" },
		member: { name: 'Member', description: 'Can do nothing' },
		denied: { name: 'Denied', description: 'Can view' },
	});

	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;

	const paginatedUsers = users.slice(startIndex, endIndex);

	const totalPages = Math.ceil(users.length / PAGE_SIZE);

	const goToPage = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return (
		<Card className="h-full w-full">
			<CardHeader className="px-7">
				<CardTitle>Users</CardTitle>
				<CardDescription>Overview of your users.</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-card">
							<TableHead className="w-[15%]">Name</TableHead>
							<TableHead className="w-[20%]">Email</TableHead>
							<TableHead className="w-[30%]">Role</TableHead>
							<TableHead>Two Factor</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedUsers.map((u) => (
							<TableRow key={u.id}>
								<TableCell className="font-medium">{u.name}</TableCell>
								<TableCell className="font-medium">{u.email}</TableCell>
								<TableCell className="font-medium">
									<Popover
										open={openPopover === u.id}
										onOpenChange={(isOpen) => {
											if (!isOpen) setOpenPopover(null);
										}}>
										<PopoverTrigger asChild>
											<Button variant="outline" className={cn('ml-auto w-42', u.role === 'superadmin' && 'pointer-events-none opacity-50')} onClick={() => setOpenPopover(u.id)}>
												{accred[u.role]?.name || 'Unknown Role'}
												<ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="p-0" align="end">
											<Command>
												<CommandInput placeholder="Select new role..." />
												<CommandList>
													<CommandEmpty>No roles found.</CommandEmpty>
													<CommandGroup>
														{Object.entries(accred)
															.slice(1, 4)
															.map(([id, role]) => (
																<CommandItem
																	key={id}
																	className="space-y-1 flex flex-col items-start px-4 py-2 cursor-pointer"
																	onSelect={() => {
																		// handleRoleChange(user.userId, parseInt(id));
																	}}>
																	<p className="text-white">{role.name}</p>
																	<p className="text-sm text-muted-foreground">{role.description}</p>
																</CommandItem>
															))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</TableCell>
								<TableCell className="font-medium">{u.isTwoFactorComplete ? 'Enable' : 'Disable'}</TableCell>
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
							{startIndex + 1}-{Math.min(endIndex, users.length)}
						</strong>{' '}
						of <strong>{users.length}</strong> users
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
