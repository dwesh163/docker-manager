import { IService, Service } from '@/models/Service';
import db from './mongo';
import { ServicesType, ServiceType } from '@/types/service';
import { getRole } from './user';
import { IUser, User } from '@/models/User';
import { ErrorType } from '@/types/error';
import { Docker, IDocker } from '@/models/Docker';
import { createNetwork } from './network';
import { IDomain, Domain } from '@/models/Domain';

export async function getServices(email: string | null | undefined): Promise<ServicesType[]> {
	await db.connect();

	if (!email) {
		return [];
	}

	const role = await getRole(email);

	let services;

	if (role.includes('admin')) {
		services = await Service.find<IService>({});
	} else {
		const user = await User.findOne<IUser>({ email });

		if (!user) {
			return [];
		}

		services = await Service.find<IService>({
			$or: [{ owner: user._id }, { users: user._id }],
		});
	}

	const allDomains = await Domain.find<IDomain>({});

	const resolvedServices = await Promise.all(
		services.map(async (service) => {
			const url = allDomains.find((d) => d.service.toString() === service._id.toString());

			console.log('url:', url);

			return {
				id: service._id.toString(),
				name: service.name,
				status: service.status,
				url: url ? `${url.subdomain && url.subdomain + '.'}${url.domain}` : '',
				repository: service.repository?.url ? { url: service.repository.url, image: service.repository.image } : null,
				slug: service.slug,
			};
		})
	);

	return resolvedServices;
}

export async function getService(email: string | null | undefined, id: string): Promise<ServiceType | null> {
	try {
		await db.connect();

		if (!email) return null;

		const [role, user] = await Promise.all([getRole(email), User.findOne<IUser>({ email })]);

		if (!user) return null;

		const query = role.includes('admin') ? { _id: id } : { $or: [{ owner: user._id }, { users: user._id }] };

		const service = await Service.findOne<IService>(query, { _id: 0, __v: 0, network: 0 });
		if (!service) return null;

		// Fetch the owner and dockers in parallel
		const [owner, dockersData] = await Promise.all([User.findOne<IUser>({ _id: service.owner }), service.dockers.length ? Docker.find({ _id: { $in: service.dockers } }, { __v: 0, 'ports._id': 0, 'mounts._id': 0, networks: 0 }) : []]);

		const dockers: ServiceType['dockers'] = (dockersData as IDocker[]).map((docker: IDocker) => ({
			id: docker._id.toString(),
			name: docker.name,
			image: docker.image,
			status: docker.status,
			ports: docker.ports,
			mounts: docker.mounts ?? [],
			currentStatus: docker.currentStatus,
			startedAt: docker.startedAt,
		}));

		// Fetch domains related to the service
		const domains = await Domain.find<IDomain>({ service: id }, { _id: 0, __v: 0, service: 0 });

		return {
			id,
			repository: service.repository?.url ? { url: service.repository.url, image: service.repository.image } : null,
			name: service.name,
			description: service.description,
			users: service.users,
			owner: service.owner.toString(),
			status: service.status,
			slug: service.slug,
			dockers,
			createdAt: service.createdAt,
			domains: domains.map((domain) => ({
				subdomain: domain.subdomain ?? null,
				domain: domain.domain,
				port: domain.port ?? null,
				docker: domain.docker ? domain.docker.toString() : null,
			})),
			url: domains.length ? `${domains[0].subdomain ? domains[0].subdomain + '.' : ''}${domains[0].domain}` : '',
		};
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

export async function createService(data: { name: string; description: string; owner: string }): Promise<ErrorType> {
	await db.connect();

	const user = await User.findOne<IUser>({ email: data.owner });

	if (!user) {
		return {
			error: 'User not found',
			status: 404,
		};
	}

	const slug = data.name.toLowerCase().replace(/ /g, '-');

	const existingService = await Service.findOne<IService>({ slug });

	if (existingService) {
		return {
			error: 'Service already exists',
			status: 400,
		};
	}

	const network = await createNetwork({ name: slug + '-network' });

	console.log('Network:', network);

	const service = await Service.create({
		name: data.name,
		description: data.description,
		owner: user,
		users: [],
		status: 'inactive',
		slug,
		network: network._id,
	});

	if (!service) {
		return {
			error: 'Service not created',
			status: 500,
		};
	}

	return {
		error: '',
		status: 200,
	};
}

export async function updateService({ name, description, repositoryUrl, id, email }: { name: string | undefined; description: string | undefined; repositoryUrl: string | undefined; id: string; email: string }): Promise<ErrorType> {
	await db.connect();

	if (!email) {
		return {
			error: 'Unauthorized',
			status: 401,
		};
	}

	const role = await getRole(email);

	let service;

	if (role.includes('admin')) {
		service = await Service.findOne<IService>({ _id: id });
	} else {
		const user = await User.findOne<IUser>({ email });

		if (!user) {
			return {
				error: 'Unauthorized',
				status: 401,
			};
		}

		service = await Service.findOne<IService>({
			$or: [{ owner: user._id }, { users: user._id }],
		});
	}

	if (!service) {
		return {
			error: 'Service not found',
			status: 404,
		};
	}

	let repository;

	if (repositoryUrl) {
		const response = await fetch(`https://api.github.com/repos/${repositoryUrl.replace('https://github.com/', '')}`, {
			headers: {
				Authorization: `token ${process.env.GITHUB_TOKEN}`,
			},
		});
		repository = await response.json();
	}

	const updatedService = await Service.updateOne(
		{ _id: service._id },
		{
			name: name || service.name,
			description: description || service.description,
			repository: repository
				? {
						url: repositoryUrl,
						image: repository?.owner?.avatar_url || '',
				  }
				: null,
		}
	);

	if (!updatedService) {
		return {
			error: 'Service not updated',
			status: 500,
		};
	}

	return {
		error: '',
		status: 200,
	};
}
