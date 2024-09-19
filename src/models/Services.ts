import mongoose, { Document } from 'mongoose';

export interface IService extends Document {
	_id: string;
	name: string;
	description: string;
	users: string[];
	dockers: {
		id: string;
		name: string;
		status: string;
		image: string;
	}[];
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
	url: { type: String, required: false },
	repository: {
		url: { type: String, required: false },
		image: { type: String, required: false },
	},
	dockers: [
		{
			id: { type: String, required: true },
			name: { type: String, required: true },
			status: { type: String, required: true },
			image: { type: String, required: true },
		},
	],
	createdAt: { type: Date, required: true, default: Date.now },
});

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
