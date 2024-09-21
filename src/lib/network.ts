import { INetwork, Network } from '@/models/Network';
import { IService, Service } from '@/models/Service';
import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock', version: 'v1.46' });

export async function createNetwork({ name }: { name: string }): Promise<INetwork> {
	try {
		const existingNetwork = await Network.findOne({ name });

		if (existingNetwork) {
			return existingNetwork;
		}

		const network = await docker.createNetwork({ Name: name });

		if (!network) {
			throw new Error('Network creation failed');
		}

		const createdNetwork = await Network.create({ id: network.id, name });

		return createdNetwork;
	} catch (error) {
		console.error('Error creating network:', error);
		throw error;
	}
}

export async function getNetwork({ serviceId }: { serviceId: string }): Promise<INetwork> {
	try {
		const service = await Service.findOne<IService>({ _id: serviceId });

		if (!service) {
			throw new Error('Service not found');
		}

		const network = await Network.findOne({ _id: service.network });

		return network;
	} catch (error) {
		console.error('Error getting network:', error);
		throw error;
	}
}
