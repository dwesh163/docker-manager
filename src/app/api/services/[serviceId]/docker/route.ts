import { createDocker } from '@/lib/docker';
import { getServerSession, Session } from 'next-auth';
import { NextResponse } from 'next/server';

interface Params {
	serviceId: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
	const { name, image } = await req.json();

	const session: Session | null = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!image || !name) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	const docker = await createDocker({ name: name.replaceAll(' ', '-').replaceAll(/[^a-zA-Z0-9_.-]/g, ''), image: image.includes(':') ? image.toLowerCase() : `${image.toLowerCase()}:latest`, serviceId: params.serviceId, owner: session.user.email || '' });

	if (docker.error) {
		return NextResponse.json({ error: docker.error }, { status: docker.status });
	}

	return NextResponse.json({ success: true });
}
