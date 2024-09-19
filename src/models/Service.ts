import mongoose, { Document } from 'mongoose';

export interface IService extends Document {
	_id: string;
	name: string;
	description: string;
	users: string[];
	dockers: string[];
	slug: string;
	owner: String;
	url: string;
	status: string;
	repository: {
		url: string;
		image: string;
	} | null;
	createdAt: Date;
}

const serviceSchema = new mongoose.Schema<IService>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	status: { type: String, required: true, default: 'Not configured' },
	slug: { type: String, required: true },
	url: { type: String, required: false },
	repository: {
		url: { type: String, required: false },
		image: { type: String, required: false },
	},
	dockers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Docker', required: false }],
	createdAt: { type: Date, required: true, default: Date.now },
});

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
