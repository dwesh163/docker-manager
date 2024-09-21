import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Container, Cpu, MemoryStick, MoveHorizontal, CloudUpload, CalendarDays, Check, HardDrive, Download, ArchiveRestore, Database, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function DockerPage() {
	return (
		<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Backup Status</CardTitle>
						<Database className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">92%</div>
						<p className="text-sm text-muted-foreground">Complete</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Backup Schedule</CardTitle>
						<Clock className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">Daily</div>
						<p className="text-sm text-muted-foreground">Every day at 11:00 PM</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pt-5 pb-1">
						<CardTitle className="text-base font-medium">Storage Usage</CardTitle>
						<HardDrive className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">120 GB</div>
						<p className="text-sm text-muted-foreground">Used</p>
					</CardContent>
				</Card>
			</div>
			<div className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Backup History</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Size</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>2023-05-01</TableCell>
									<TableCell>25 GB</TableCell>
									<TableCell>
										<Badge variant="secondary">Completed</Badge>
									</TableCell>
									<TableCell>
										<Button variant="ghost" size="icon">
											<Download className="w-4 h-4" />
											<span className="sr-only">Download Backup</span>
										</Button>
										<Button variant="ghost" size="icon">
											<ArchiveRestore className="w-4 h-4" />
											<span className="sr-only">Restore from Backup</span>
										</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2023-04-15</TableCell>
									<TableCell>22 GB</TableCell>
									<TableCell>
										<Badge variant="secondary">Completed</Badge>
									</TableCell>
									<TableCell>
										<Button variant="ghost" size="icon">
											<Download className="w-4 h-4" />
											<span className="sr-only">Download Backup</span>
										</Button>
										<Button variant="ghost" size="icon">
											<ArchiveRestore className="w-4 h-4" />
											<span className="sr-only">Restore from Backup</span>
										</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2023-04-01</TableCell>
									<TableCell>20 GB</TableCell>
									<TableCell>
										<Badge variant="secondary">Completed</Badge>
									</TableCell>
									<TableCell>
										<Button variant="ghost" size="icon">
											<Download className="w-4 h-4" />
											<span className="sr-only">Download Backup</span>
										</Button>
										<Button variant="ghost" size="icon">
											<ArchiveRestore className="w-4 h-4" />
											<span className="sr-only">Restore from Backup</span>
										</Button>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Backup Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<Button size="lg">
								<CloudUpload className="w-5 h-5 mr-2" />
								Backup Now
							</Button>
							<Button variant="outline" size="lg">
								<CalendarDays className="w-5 h-5 mr-2" />
								Schedule Backup
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
