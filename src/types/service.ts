import { DockerType } from './docker';
export interface ServicesType {
	id: string;
	name: string;
	status: string;
	url: string;
	repository?: {
		url: string;
		image: string;
	};
}

export interface ServiceType {
	id: string;
	name: string;
	description: string;
	owner: string;
	status: string;
	users: string[];
	dockers: DockerType[];
	url: string;
	repository?: {
		url: string;
		image: string;
	};
	createdAt: Date;
}
