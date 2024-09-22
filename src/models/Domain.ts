import mongoose, { Document } from 'mongoose';

export interface IDomain extends Document {
	_id: string;
	subdomain?: string;
	domain: string;
	service: String;
	docker: String;
	port: number;
}

const domainSchema = new mongoose.Schema<IDomain>({
	subdomain: { type: String, required: false },
	domain: { type: String, required: true },
	service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
	docker: { type: mongoose.Schema.Types.ObjectId, ref: 'Docker', required: false },
	port: { type: Number, required: false },
});

export const Domain = mongoose.models.Domain || mongoose.model<IDomain>('Domain', domainSchema);
