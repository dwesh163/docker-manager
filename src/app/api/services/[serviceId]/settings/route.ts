import { getServerSession, Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { updateService } from '@/lib/service';

interface Params {
	serviceId: string;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
	const { name, description, repositoryUrl } = await req.json();

	const session: Session | null = await getServerSession();

	console.log('session', session);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!description && !name && !repositoryUrl) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	const service = await updateService({ name, description, repositoryUrl: repositoryUrl !== '' ? repositoryUrl.replace(/\/$/, '') : undefined, id: params.serviceId, email: session?.user?.email || '' });

	if (service.error) {
		return NextResponse.json({ error: service.error }, { status: service.status });
	}

	return NextResponse.json({ success: true });
}
