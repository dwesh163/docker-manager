import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
	return (
		<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full">
			<Card className="w-full" x-chunk="dashboard-06-chunk-0">
				<CardHeader>
					<CardTitle>Docker Dashboard</CardTitle>
					<CardDescription>Overview of your Docker services</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						<Card>
							<CardHeader>
								<CardTitle>Services</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div>
										<span className="text-4xl font-bold">12</span>
										<span className="text-muted-foreground"> running</span>
									</div>
									<ServerIcon className="h-8 w-8" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Down Services</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div>
										<span className="text-4xl font-bold text-red-500">3</span>
										<span className="text-muted-foreground"> down</span>
									</div>
									<CircleAlertIcon className="h-8 w-8 text-red-500" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Virtual Machine</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div>
										<span className="text-4xl font-bold text-green-500">Running</span>
									</div>
									<ServerIcon className="h-8 w-8 text-green-500" />
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Recent Services</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>
										<div className="font-medium">Nginx</div>
									</TableCell>
									<TableCell>
										<Badge variant="secondary">Running</Badge>
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoveVerticalIcon className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Stop</DropdownMenuItem>
												<DropdownMenuItem>Restart</DropdownMenuItem>
												<DropdownMenuItem>Logs</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<div className="font-medium">PostgreSQL</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline">Down</Badge>
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoveVerticalIcon className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Start</DropdownMenuItem>
												<DropdownMenuItem>Logs</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<div className="font-medium">Redis</div>
									</TableCell>
									<TableCell>
										<Badge variant="secondary">Running</Badge>
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoveVerticalIcon className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Stop</DropdownMenuItem>
												<DropdownMenuItem>Restart</DropdownMenuItem>
												<DropdownMenuItem>Logs</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function CircleAlertIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<line x1="12" x2="12" y1="8" y2="12" />
			<line x1="12" x2="12.01" y1="16" y2="16" />
		</svg>
	);
}

function DockIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M2 8h20" />
			<rect width="20" height="16" x="2" y="4" rx="2" />
			<path d="M6 16h12" />
		</svg>
	);
}

function MenuIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>
	);
}

function MoveVerticalIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<polyline points="8 18 12 22 16 18" />
			<polyline points="8 6 12 2 16 6" />
			<line x1="12" x2="12" y1="2" y2="22" />
		</svg>
	);
}

function NetworkIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect x="16" y="16" width="6" height="6" rx="1" />
			<rect x="2" y="16" width="6" height="6" rx="1" />
			<rect x="9" y="2" width="6" height="6" rx="1" />
			<path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
			<path d="M12 12V8" />
		</svg>
	);
}

function ServerIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
			<rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
			<line x1="6" x2="6.01" y1="6" y2="6" />
			<line x1="6" x2="6.01" y1="18" y2="18" />
		</svg>
	);
}

function SettingsIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

function TrainTrackIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M2 17 17 2" />
			<path d="m2 14 8 8" />
			<path d="m5 11 8 8" />
			<path d="m8 8 8 8" />
			<path d="m11 5 8 8" />
			<path d="m14 2 8 8" />
			<path d="M7 22 22 7" />
		</svg>
	);
}

function ViewIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
			<path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
			<path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
			<path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
		</svg>
	);
}
