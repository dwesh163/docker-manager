import { IService, Service } from '@/models/Services';
import db from './mongo';
import { ServicesType } from '@/types/service';
import { getRole } from './user';
import { IUser, User } from '@/models/User';
import { ErrorType } from '@/types/error';

export async function getServices(email: string | null | undefined): Promise<ServicesType[]> {
	await db.connect();

	if (!email) {
		return [];
		throw new Error('Email is required');
	}

	const role = await getRole(email);

	let services;

	if (role.includes('admin')) {
		services = await Service.find<IService>({});
	} else {
		const user = await User.findOne<IUser>({ email });

		if (!user) {
			return [];
			throw new Error('User not found');
		}

		services = await Service.find<IService>({
			$or: [{ owner: user._id }, { users: user._id }],
		});
	}

	return services.map((service) => {
		return {
			id: service._id.toString(),
			name: service.name,
			status: service.status,
		};
	});
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

	const service = await Service.create({
		name: data.name,
		description: data.description,
		owner: user,
		users: [],
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
