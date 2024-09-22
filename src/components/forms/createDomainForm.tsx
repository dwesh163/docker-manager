'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { ServicesType } from '@/types/service';

export function CreateDomainForm({ serviceId }: { serviceId?: string }) {
	const [url, setUrl] = useState('');
	const [service, setService] = useState(serviceId || '');
	const [services, setServices] = useState<ServicesType[]>([]);
	const [error, setError] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const res = await fetch('/api/services');
				const data = await res.json();
				console.log('data', data);
				setServices(data);
			} catch (error) {
				setError('Failed to fetch services.');
			}
		};

		fetchServices();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!url) {
			setError('Domain is required.');
			return;
		}

		const urlParts = url.split('.');
		if (urlParts.length < 2) {
			setError('Invalid domain format.');
			return;
		}

		const domain = urlParts.slice(-2).join('.');
		const subdomain = urlParts.slice(0, -2).join('.');

		setError('');

		try {
			const res = await fetch('/api/domains', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					subdomain,
					domain,
					service,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				router.refresh();
				setUrl('');
				setService('');
				setIsOpen(false);
			} else {
				setError(data.error || 'Failed to link the domain.');
			}
		} catch (error) {
			setError('Failed to link the domain.');
		}
	};

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="flex items-center justify-between gap-1">
					<Plus className="h-4 w-4" />
					<p className="-mt-0.5">Link a Domain</p>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Link a domain</DialogTitle>
					<DialogDescription>Expose your service with a domain</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="url" className="text-right">
							Url
						</Label>
						<Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" />
					</div>
					{!serviceId && (
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="service" className="text-right">
								Service
							</Label>
							<Select onValueChange={(value) => setService(value)}>
								<SelectTrigger className="w-[275px]">
									<SelectValue placeholder="Service" />
								</SelectTrigger>
								<SelectContent>
									{services.map((service) => (
										<SelectItem key={service.id} value={service.id}>
											{service.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
					{error && <p className="text-red-500">{error}</p>}
					<DialogFooter>
						<Button type="submit">Link</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
