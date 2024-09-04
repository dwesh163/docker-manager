import Docker from 'dockerode';

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
