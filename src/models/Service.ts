import mongoose, { Document } from 'mongoose';

export interface IService extends Document {
	_id: string;
	name: string;
	description: string;
	users: string[];
	dockers: string[];
	slug: string;
	owner: String;
	status: string;
	repository: {
		url: string;
		image: string;
	} | null;
	network: String;
	createdAt: Date;
}

const serviceSchema = new mongoose.Schema<IService>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	status: { type: String, required: true, default: 'Not configured' },
	slug: { type: String, required: true },
	repository: {
		url: { type: String, required: false },
		image: { type: String, required: false },
	},
	dockers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Docker', required: false }],
	network: { type: mongoose.Schema.Types.ObjectId, ref: 'Network', required: false },
	createdAt: { type: Date, required: true, default: Date.now },
});

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
