'use client';
import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ServiceType } from '@/types/service';

export function EditServiceForm({ service, trigger }: { service: ServiceType; trigger: ReactNode }) {
	const [name, setName] = useState(service.name);
	const [description, setDescription] = useState(service.description);
	const [repository, setRepository] = useState(service.repository?.url || '');
	const [error, setError] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name && !description && !repository) {
			setError('Both name, description and repository are required.');
			return;
		}

		setError('');

		try {
			const res = await fetch(`/api/services/${service.id}/settings`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: name !== '' ? name : undefined,
					description: description !== '' ? description : undefined,
					repository: repository !== '' ? repository : undefined,
				}),
			});

			if (res.ok) {
				router.refresh();
				setIsOpen(false);
			} else {
				setError('Failed to edit the service.');
			}
		} catch (error) {
			setError('An error occurred while editing the service.');
		}
	};

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Service</DialogTitle>
					<DialogDescription>Edit the existing service</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="description" className="text-right">
							Description
						</Label>
						<Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="repository" className="text-right">
							Repository
						</Label>
						<Input id="repository" value={repository} onChange={(e) => setRepository(e.target.value)} className="col-span-3" />
					</div>
					{error && <p className="text-red-500">{error}</p>}
					<DialogFooter>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
