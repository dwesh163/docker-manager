import { Domain as DomainModel } from '@/models/Domain';
import { Service as ServiceModel } from '@/models/Service';
import { DomainsType } from '@/types/domain';
import { getRole } from './user';
import { getServices } from './service';
import { ErrorType } from '@/types/error';
import db from '@/lib/mongo';

export async function getDomains(email: string | null | undefined): Promise<DomainsType[]> {
	try {
		await db.connect();

		if (!email) {
			return [];
		}

		const role = await getRole(email);

		if (!role) {
			return [];
		}

		const services = await getServices(email);

		const domains = await DomainModel.find();

		const resolvedDomains = domains.map((domain) => {
			const service = services.find((s) => s.id === domain.service.toString());

			if (!service && !role.includes('admin')) {
				return null;
			}

			return {
				id: domain._id.toString(),
				subdomain: domain.subdomain,
				domain: domain.domain,
				service: service
					? {
							name: service.name,
							id: service.id,
					  }
					: null,
			};
		});

		return resolvedDomains.filter((d) => d !== null) as DomainsType[];
	} catch (error) {
		console.error('Error getting domains:', error);
		return [];
	}
}

export async function createDomain({ subdomain, domain, service, owner }: { subdomain: string; domain: string; service: string; owner: string }): Promise<ErrorType> {
	try {
		await db.connect();

		const existingDomain = await DomainModel.findOne({ subdomain, domain });
		if (existingDomain) {
			return { error: 'Domain already exists', status: 400 };
		}

		const existingService = await ServiceModel.findOne({ _id: service });
		if (!existingService) {
			return { error: 'Service not found', status: 404 };
		}

		const newDomain = await DomainModel.create({
			subdomain,
			domain,
			service: existingService._id,
		});

		if (!newDomain) {
			return {
				error: 'Error creating domain',
				status: 500,
			};
		}

		return {
			error: '',
			status: 200,
		};
	} catch (error) {
		console.error('Error creating domain:', error);
		return { error: 'Internal Server Error', status: 500 };
	}
}

export async function updateDomain({ id, subdomain, domain, service, docker, port, owner }: { id: string; subdomain: string; domain: string; service: string; docker: string; port: string; owner: string }): Promise<ErrorType> {
	try {
		await db.connect();

		console.log('id', id);
		const existingDomain = await DomainModel.findOne({ _id: id });
		if (!existingDomain) {
			return { error: 'Domain not found', status: 404 };
		}

		let serviceId = service;

		if (!service) {
			serviceId = existingDomain.service.toString();
		}

		const existingService = await ServiceModel.findOne({ _id: serviceId });
		if (!existingService) {
			return { error: 'Service not found', status: 404 };
		}

		existingDomain.subdomain = subdomain || existingDomain.subdomain;
		existingDomain.domain = domain || existingDomain.domain;
		existingDomain.service = existingService._id;
		existingDomain.docker = docker || existingDomain.docker;
		existingDomain.port = port || existingDomain.port;

		await existingDomain.save();

		return {
			error: '',
			status: 200,
		};
	} catch (error) {
		console.error('Error updating domain:', error);
		return { error: 'Internal Server Error', status: 500 };
	}
}
