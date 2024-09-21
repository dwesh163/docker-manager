import { INetwork, Network } from '@/models/Network';
import { IService, Service } from '@/models/Service';
import { IDocker, Docker as DockerModel } from '@/models/Docker';
import { NetwoksType } from '@/types/network';
import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock', version: 'v1.46' });

export async function createNetwork({ name }: { name: string }): Promise<INetwork> {
	try {
		const existingNetwork: INetwork | null = await Network.findOne({ name });

		const dockerNetworks = await docker.listNetworks({ filters: { name: [name] } });
		const existingDockerNetwork = dockerNetworks.find((n: any) => n.Name === name);

		if (existingNetwork && !existingDockerNetwork) {
			const network = await docker.createNetwork({ Name: name });
			if (!network) {
				throw new Error('Failed to create network in Docker');
			}

			console.log('Network created in Docker:', network);
			return existingNetwork;
		}

		if (!existingNetwork && existingDockerNetwork) {
			const createdNetwork = await Network.create({
				id: existingDockerNetwork.Id,
				name: existingDockerNetwork.Name,
			});

			console.log('Network created in DB:', createdNetwork);
			return createdNetwork;
		}

		if (!existingNetwork && !existingDockerNetwork) {
			const network = await docker.createNetwork({ Name: name });
			if (!network) {
				throw new Error('Failed to create network');
			}

			const createdNetwork = await Network.create({ id: network.id, name });
			console.log('Network created in Docker and DB:', createdNetwork);

			return createdNetwork;
		}

		return existingNetwork as INetwork;
	} catch (error) {
		console.error('Error creating or checking network:', error);
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

export async function getNetworks(): Promise<NetwoksType[]> {
	try {
		const networks = await Network.find();

		const dockers = await DockerModel.find();

		const networksData = networks.map((network) => {
			const dockersData = dockers.filter((docker) => docker.networks.includes(network._id.toString()));

			return {
				name: network.name,
				dockers: dockersData.map((docker) => ({ name: docker.name, image: docker.image })),
			};
		});

		return networksData;
	} catch (error) {
		console.error('Error getting networks:', error);
		throw error;
	}
}
