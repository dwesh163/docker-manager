export interface DomainsType {
	id: string;
	subdomain: string;
	domain: string;
	service: {
		name: string;
		id: string;
	} | null;
}

export interface DomainType {
	id: string;
}
