'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { NetwoksType } from '@/types/network';

export function NetworkVisualization({ networksData }: { networksData: NetwoksType[] }) {
	return (
		<Card className="h-full w-full">
			<CardHeader className="px-7 pb-3">
				<CardTitle>Networks</CardTitle>
				<CardDescription>Overview of your networks.</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4 grid-cols-2">
				{networksData.map((network, index) => (
					<div key={'network' + index} className="w-full">
						<div className="flex items-center justify-between mb-1">
							<h3 className="text-lg font-semibold tracking-tight">{network.name}</h3>
						</div>
						<Card className="w-full">
							<CardContent className="grid grid-cols-3 gap-2 p-3">
								{network.dockers.map((d, index) => (
									<Card key={'docker' + index} className="p-1">
										<CardHeader className="p-2 space-y-0.5">
											<CardTitle className="text-sm">{d.name}</CardTitle>
											<CardDescription>{d.image}</CardDescription>
										</CardHeader>
									</Card>
								))}
							</CardContent>
						</Card>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
