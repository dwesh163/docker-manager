'use client';
import { SetStateAction, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TwoFactorAuth() {
	const [showSecret, setShowSecret] = useState(false);
	const [QRCodePage, setQRCodePage] = useState(true);
	const [error, setError] = useState('');
	const [otp, setOtp] = useState('');

	const router = useRouter();

	async function handleEnableTwoFactor() {
		try {
			const response = await fetch(`/api/auth/factor/verify`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ otp }),
			});
			const body = await response.json();

			if (response.status === 200) {
				console.log(body);
				router.push('/');
				return;
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<div className="flex items-center justify-center w-full h-screen flex-col ">
			<div className="flex flex-col gap-12 justify-center items-center mb-8 -mt-6">
				<h1 className="sm:text-4xl text-2xl font-black">Kooked Manager</h1>
				<div className="space-y-2 -mt-2">
					<Label htmlFor="code" className="flex items-center justify-center">
						Enter 2FA Code
					</Label>
					<div className="space-y-2 flex items-center justify-center">
						<InputOTP maxLength={6} value={otp} onChange={(value: SetStateAction<string>) => setOtp(value)}>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</div>
					{error != '' && <p className="text-center text-sm text-red-500">{error}The submitted code is invalid</p>}
					<Button onClick={handleEnableTwoFactor} className="w-full">
						Submit
					</Button>
				</div>
			</div>
		</div>
	);
}
