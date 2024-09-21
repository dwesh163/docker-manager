'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { NetwoksType } from '@/types/network';

export function NetworksCard({ networksData }: { networksData: NetwoksType[] }) {
	return (
		<Card className="h-full w-full">
			<CardHeader className="px-7">
				<CardTitle>Networks</CardTitle>
				<CardDescription>Overview of your networks.</CardDescription>
			</CardHeader>
			<CardContent>{JSON.stringify(networksData)}</CardContent>
		</Card>
	);
}
