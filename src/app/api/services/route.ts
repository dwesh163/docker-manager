import { createService, getServices } from '@/lib/service';
import { getServerSession, Session } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { name, description } = await req.json();

	const session: Session | null = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!description || !name) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	const service = await createService({ name, description, owner: session.user.email || '' });

	if (service.error) {
		return NextResponse.json({ error: service.error }, { status: service.status });
	}

	return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
	const session: Session | null = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const services = await getServices(session.user.email);

	return NextResponse.json(services);
}
