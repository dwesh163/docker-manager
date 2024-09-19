import { DockerType } from './docker';
export interface ServicesType {
	id: string;
	name: string;
	status: string;
	url: string;
	slug: string;
	repository: {
		url: string;
		image: string;
	} | null;
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
	slug: string;
	repository: {
		url: string;
		image: string;
	} | null;
	createdAt: Date;
}
