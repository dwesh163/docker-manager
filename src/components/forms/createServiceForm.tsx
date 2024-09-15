'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export function CreateServiceForm() {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !description) {
			setError('Both name and description are required.');
			return;
		}

		setError('');

		try {
			const res = await fetch('/api/services', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					description,
				}),
			});

			if (res.ok) {
				router.refresh();
				setIsOpen(false);
			} else {
				setError('Failed to create the service.');
			}
		} catch (error) {
			setError('An error occurred while creating the service.');
		}
	};

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="flex items-center justify-between gap-1">
					<Plus className="h-4 w-4" />
					<p className="-mt-0.5">Create Service</p>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Service</DialogTitle>
					<DialogDescription>Create a new service</DialogDescription>
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
					{error && <p className="text-red-500">{error}</p>}
					<DialogFooter>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
