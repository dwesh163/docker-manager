'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ServiceType } from '@/types/service';

export function CreateDockerForm({ ServiceId }: { ServiceId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedMethode, setSelectedMethode] = useState('');

	useEffect(() => {
		if (isOpen) {
			setSelectedMethode('');
		}
	}, [isOpen]);

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="flex items-center justify-between gap-1">
					<Plus className="h-4 w-4" />
					<p className="-mt-0.5">Create Containers</p>
				</Button>
			</DialogTrigger>
			{selectedMethode === 'image' && <CreateFromImage ServiceId={ServiceId} setIsOpen={setIsOpen} />}
			{selectedMethode === 'dockerfile' && <CreateFromDockerfile />}
			{selectedMethode === '' && (
				<DialogContent className="">
					<DialogHeader>
						<DialogTitle className="text-2xl font-semibold leading-none tracking-tight">Create Container</DialogTitle>
						<DialogDescription className="text-sm">Create a new container</DialogDescription>
					</DialogHeader>
					<Card className="cursor-pointer hover:border-white" onClick={() => setSelectedMethode('dockerfile')}>
						<CardHeader className="pt-4">
							<CardTitle className="text-xl">
								Deploy from <strong>Build</strong>
							</CardTitle>
							<CardDescription>Deploy your Docker from a Dockerfile present in a GitHub repository.</CardDescription>
						</CardHeader>
					</Card>
					<Card className="cursor-pointer hover:border-white" onClick={() => setSelectedMethode('image')}>
						<CardHeader className="pt-4">
							<CardTitle className="text-xl">
								Deploy from <strong>Docker Hub</strong>
							</CardTitle>
							<CardDescription>Deploy your Docker from a public image in Docker Hub.</CardDescription>
						</CardHeader>
					</Card>
				</DialogContent>
			)}
		</Dialog>
	);
}

function CreateFromImage({ ServiceId, setIsOpen }: { ServiceId: string; setIsOpen: (value: boolean) => void }) {
	const [name, setName] = useState('');
	const [image, setImage] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !image) {
			setError('Both name and image are required.');
			return;
		}

		setError('');

		try {
			const res = await fetch(`/api/services/${ServiceId}/docker`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					image,
				}),
			});

			if (res.ok) {
				router.refresh();
				setIsOpen(false);
			} else {
				const error = await res.json();
				setError(error.error);
			}
		} catch (error) {
			setError('An error occurred while creating the containers.');
		}
	};

	return (
		<DialogContent className="">
			<DialogHeader>
				<DialogTitle>Create Container</DialogTitle>
				<DialogDescription>Create a new container</DialogDescription>
			</DialogHeader>
			<form onSubmit={handleSubmit} className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="name" className="text-right">
						Name
					</Label>
					<Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="image" className="text-right">
						Image
					</Label>
					<Input id="image" value={image} onChange={(e) => setImage(e.target.value)} className="col-span-3" />
				</div>
				{error && <p className="text-red-500">{error}</p>}
				<DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

function CreateFromDockerfile() {
	return (
		<div>
			<Label htmlFor="dockerfile" className="text-right">
				Dockerfile
			</Label>
			<Input id="dockerfile" value={dockerfile} onChange={(e) => setDockerfile(e.target.value)} className="col-span-3" />
		</div>
	);
}
