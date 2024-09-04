import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CircleAlert, MoveVertical, Server } from 'lucide-react';

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
									<Server className="h-8 w-8" />
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
									<CircleAlert className="h-8 w-8 text-red-500" />
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
									<Server className="h-8 w-8 text-green-500" />
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
													<MoveVertical className="h-4 w-4" />
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
													<MoveVertical className="h-4 w-4" />
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
													<MoveVertical className="h-4 w-4" />
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
