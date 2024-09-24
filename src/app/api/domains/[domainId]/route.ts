import { updateDomain } from '@/lib/domain';
import { getServerSession, Session } from 'next-auth';
import { NextResponse } from 'next/server';

interface Params {
	domainId: string;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
	const { subdomain, domain, service, docker, port } = await req.json();

	const session: Session | null = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const newDomain = await updateDomain({ id: params.domainId, subdomain, domain, service, docker, port, owner: session.user.email || '' });

	if (newDomain.error) {
		return NextResponse.json({ error: newDomain.error }, { status: newDomain.status });
	}

	return NextResponse.json({ success: true });
}
