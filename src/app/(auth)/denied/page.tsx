'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DeniedPage() {
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	const fetchRole = async () => {
		const response = await fetch(`/api/auth/role`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const body = await response.json();

		if (response.status === 200) {
			router.push('/');
			return;
		} else {
			setLoading(false);
		}
	};

	setTimeout(() => {
		fetchRole();
	}, 1000);

	return (
		<div className="flex items-center justify-center w-full h-screen flex-col ">
			<div className="flex flex-col gap-12 justify-center items-center mb-8 -mt-6">
				<h1 className="sm:text-4xl text-2xl font-black">Kooked Manager</h1>
				<div className="space-y-2 -mt-2">
					{loading ? (
						<Loader2 className="size-5 animate-spin" />
					) : (
						<Label htmlFor="code" className="flex items-center justify-center">
							You cannot access this page.
						</Label>
					)}
				</div>
			</div>
		</div>
	);
}
