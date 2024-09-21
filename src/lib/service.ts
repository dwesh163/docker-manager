import { IService, Service } from '@/models/Service';
import db from './mongo';
import { ServicesType, ServiceType } from '@/types/service';
import { getRole } from './user';
import { IUser, User } from '@/models/User';
import { ErrorType } from '@/types/error';
import { Docker } from '@/models/Docker';
import { createNetwork } from './network';

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

	const resolvedServices = await Promise.all(
		services.map(async (service) => {
			return {
				id: service._id.toString(),
				name: service.name,
				status: service.status,
				url: service.url,
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

		if (!email) {
			return null;
		}

		const role = await getRole(email);
		let service;

		if (role.includes('admin')) {
			service = await Service.findOne<IService>({ _id: id }, { _id: 0, __v: 0, network: 0 });
		} else {
			const user = await User.findOne<IUser>({ email });

			if (!user) {
				return null;
			}

			service = await Service.findOne<IService>(
				{
					$or: [{ owner: user._id }, { users: user._id }],
				},
				{ _id: 0, __v: 0, network: 0 }
			);
		}

		if (!service) {
			return null;
		}

		const owner = await User.findOne<IUser>({ _id: service.owner });

		if (service.dockers.length !== 0) {
			service.dockers = await Docker.find(
				{
					_id: { $in: service.dockers },
				},
				{ _id: 0, __v: 0, 'ports._id': 0, 'mounts._id': 0, 'network._id': 0 }
			);
		}

		return {
			...service.toObject(),
			owner: owner?.name,
			repository: service.repository?.url ? { url: service.repository.url, image: service.repository.image } : null,
			id,
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
