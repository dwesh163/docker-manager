'use client';
import { SetStateAction, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EnablePage() {
	const [showSecret, setShowSecret] = useState(false);
	const [QRCodePage, setQRCodePage] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [secret, setSecret] = useState('');
	const [otp, setOtp] = useState('');
	const [QRUri, setQRUri] = useState('');

	const router = useRouter();

	useEffect(() => {
		const fetchQRCode = async () => {
			try {
				const response = await fetch(`/api/auth/factor/setup`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const body = await response.json();

				if (response.status === 200) {
					setQRUri(body.QRUri);
					setSecret(body.secret);
					setIsLoading(false);
					return;
				}
			} catch (e) {
				console.error(e);
			}
		};

		fetchQRCode();
	}, []);

	async function handleEnableTwoFactor() {
		try {
			const response = await fetch(`/api/auth/factor/enable`, {
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
		<div className="flex items-center justify-center w-full sm:h-screen flex-col sm:p-5 p-2 py-5 mt-12 sm:mt-0">
			<Card className="w-full max-w-md border-0 sm:border bg-background sm:bg-card">
				<CardHeader>
					<CardTitle>Enable 2-Factor Authentication</CardTitle>
					<CardDescription>{QRCodePage ? 'Scan the QR code or enter the secret text to set up 2FA on your account.' : 'Enter the 6-digit code supplied by your phone'}</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6">
					{QRCodePage &&
						(isLoading ? (
							<div className="flex items-center justify-center h-[200px]">
								<Loader2 className="size-5 animate-spin" />
							</div>
						) : (
							<div className="flex justify-center">
								<img src={QRUri} alt="QR Code" width="200" height="200" style={{ aspectRatio: '1', objectFit: 'cover' }} />
							</div>
						))}

					{QRCodePage && showSecret && (
						<div className="space-y-2">
							<Label htmlFor="secret">Secret Text</Label>
							<Input id="secret" value={secret} readOnly />
						</div>
					)}
					{!QRCodePage && (
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
						</div>
					)}
				</CardContent>
				<CardFooter className={cn('flex', !QRCodePage ? 'justify-end' : 'justify-between')}>
					{QRCodePage && (
						<Button variant="ghost" onClick={() => setShowSecret((prev) => !prev)}>
							{showSecret ? 'Hide' : 'Show'} Secret
						</Button>
					)}
					{!QRCodePage ? <Button onClick={() => handleEnableTwoFactor()}>Enable 2FA</Button> : <Button onClick={() => setQRCodePage(false)}>Next</Button>}
				</CardFooter>
			</Card>
		</div>
	);
}
