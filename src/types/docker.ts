export type DockerType = {
	id: string;
	name: string;
	status: string;
	image: string;
	currentStatus: string;
	startedAt: Date;
	mounts: {
		source: string;
		target: string;
	}[];
	ports: {
		in: number;
		out?: number;
	}[];
};
