import { createService, getService } from '@/lib/service';
import { getServerSession, Session } from 'next-auth';
import { NextResponse } from 'next/server';

interface Params {
	serviceId: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
	const session: Session | null = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const services = await getService(session.user.email, params.serviceId);

	return NextResponse.json(services);
}
