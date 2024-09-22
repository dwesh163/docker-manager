import { createDomain } from '@/lib/domain';
import { getServerSession, Session } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { subdomain, domain, service } = await req.json();

	const session: Session | null = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!domain || !service) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	const newDomain = await createDomain({ subdomain, domain, service, owner: session.user.email || '' });

	if (newDomain.error) {
		return NextResponse.json({ error: newDomain.error }, { status: newDomain.status });
	}

	return NextResponse.json({ success: true });
}
