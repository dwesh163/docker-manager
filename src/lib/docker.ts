import Docker from 'dockerode';
import { getService } from './service';
import { Docker as DockerModel } from '@/models/Docker';
import { Service } from '@/models/Service';
import { Image } from '@/models/Image';
import { getNetwork } from './network';

const docker = new Docker({ socketPath: '/var/run/docker.sock', version: 'v1.46' });

export async function getDockers() {
	try {
		const dockers = await docker.listContainers({
			all: true,
			filters: { status: ['running', 'exited', 'restarting'] },
		});

		const dataPromises = dockers.map(async (d) => {
			const container = docker.getContainer(d.Id);
			const stats = await container.stats({ stream: false });

			const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
			const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
			const numCpus = stats.cpu_stats.online_cpus || 1;
			let cpuPercent = 0;

			if (systemDelta > 0 && cpuDelta > 0) {
				cpuPercent = (cpuDelta / systemDelta) * numCpus * 100;
			}

			return {
				id: d.Id,
				name: d.Names[0].slice(1),
				state: d.State,
				status: d.Status,
				image: d.Image,
				cpuUsage: cpuPercent,
				memoryUsage: (stats.memory_stats.usage || 0) / 1073741824,
			};
		});

		const data = await Promise.all(dataPromises);

		const stats = {
			running: data.filter((d) => d.state === 'running').length,
			stopped: data.filter((d) => d.state === 'exited').length,
			totalCpuUsage: data.map((d) => d.cpuUsage).reduce((a, b) => a + b, 0),
			totalMemoryUsage: data.map((d) => d.memoryUsage || 0).reduce((a, b) => a + b, 0),
		};

		return {
			dockers: data,
			stats,
		};
	} catch (error) {
		console.error('Error getting Docker stats:', error);
	}
}

export async function createDocker({ name, image, serviceId, owner }: { name: string; image: string; serviceId: string; owner: string }) {
	try {
		const service = await getService(owner, serviceId);

		if (!service) {
			return { error: 'Service not found', status: 404 };
		}

		const existingDocker = await DockerModel.findOne({ name: `${service.slug}-${name}` });

		if (existingDocker) {
			return { error: 'Docker container already exists', status: 400 };
		}

		const network = await getNetwork({ serviceId });

		const ports: { in: number; out?: number }[] = [];
		const mounts: { source: string; target: string }[] = [];
		const env: { key: string; value: string }[] = [];

		const newDocker = await DockerModel.create({
			name: `${service.slug}-${name}`,
			status: 'starting',
			image,
			service: serviceId,
			currentStatus: 'starting',
			mounts,
			ports,
			networks: [network._id],
		});

		await Service.updateOne({ $push: { dockers: newDocker._id } });

		continueDockerCreation(newDocker, image, service.slug, name, network.id, env, ports, mounts);

		return { success: true };
	} catch (error) {
		console.error('Error creating Docker container:', error);
		return { error: 'Error creating Docker container', status: 500 };
	}
}

async function continueDockerCreation(newDocker: any, image: string, serviceSlug: string, name: string, network: string, env: { key: string; value: string }[], ports: { in: number; out?: number }[], mounts: { source: string; target: string }[]) {
	try {
		await ensureImageExists(image);

		const container = await docker.createContainer({
			name: `${serviceSlug}-${name}`,
			Image: image,
			Env: env.map((e) => `${e.key}=${e.value}`),
			ExposedPorts: ports.reduce((acc: { [key: string]: {} }, p) => {
				acc[`${p.in}/tcp`] = {};
				return acc;
			}, {} as { [key: string]: {} }),
			HostConfig: {
				PortBindings: ports.reduce((acc: { [key: string]: [{ HostPort: string }] }, p) => {
					acc[`${p.in}/tcp`] = [{ HostPort: `${p.out}` }];
					return acc;
				}, {} as { [key: string]: [{ HostPort: string }] }),
				Binds: mounts.map((m) => `${m.source}:${m.target}`),
				NetworkMode: network,
			},
		});
		await container.start();

		const containerDetails = await container.inspect();
		await DockerModel.updateOne(
			{ _id: newDocker._id },
			{
				$set: {
					status: 'running',
					currentStatus: containerDetails.State.Status,
					id: container.id,
					ports: Object.keys(containerDetails.NetworkSettings.Ports).map((key) => {
						const [inPort, protocol] = key.split('/');
						const portBinding = containerDetails.NetworkSettings.Ports[key];

						if (portBinding) {
							return {
								in: parseInt(inPort, 10),
								out: parseInt(portBinding[0].HostPort, 10),
							};
						} else {
							return { in: parseInt(inPort, 10) };
						}
					}),
				},
			}
		);
	} catch (error) {
		console.error('Error starting Docker container:', error);
		await DockerModel.updateOne(
			{ _id: newDocker._id },
			{
				$set: { status: 'failed', currentStatus: 'failed' },
			}
		);
	}
}

export async function ensureImageExists(image: string) {
	const saveImage = async (imageName: string) => {
		const existingImage = await Image.findOne({ name: imageName });

		if (existingImage) {
			return;
		}

		const images = await docker.listImages({ filters: { reference: [imageName] } });

		if (images.length > 0) {
			await Image.create({
				name: imageName,
				id: images[0].Id.replace('sha256:', ''),
				size: images[0].Size,
				createdAt: new Date(images[0].Created * 1000),
			});
		}
	};

	try {
		const images = await docker.listImages({ filters: { reference: [image] } });

		if (images.length === 0) {
			await new Promise((resolve, reject) => {
				docker.pull(image, {}, (err, stream) => {
					if (err) {
						return reject(err);
					}
					if (stream) {
						docker.modem.followProgress(stream, (done: any) => {
							saveImage(image).then(resolve).catch(reject);
						});
					}
				});
			});

			return true;
		} else {
			await saveImage(image);
			return true;
		}
	} catch (error) {
		console.error("Erreur lors de la vérification/téléchargement de l'image:", error);
		return false;
	}
}
