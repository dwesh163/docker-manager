import { IService, Service } from '@/models/Service';
import { Docker } from '@/models/Docker';

export async function updateServiceStatus(serviceId: string) {
	try {
		const service = await Service.findOne<IService>({ _id: serviceId });

		if (!service) {
			throw new Error('Service not found');
		}

		const dockers = await Docker.find({ _id: { $in: service.dockers } });

		let status = 'running';

		for (const docker of dockers) {
			if (docker.status !== docker.currentStatus) {
				status = 'down';
				break;
			}
		}

		await Service.updateOne({ _id: serviceId }, { status });
	} catch (error) {
		console.error('Error updating service status:', error);
		throw error;
	}
}
