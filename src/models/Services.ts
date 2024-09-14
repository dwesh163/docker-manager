import mongoose, { Document } from 'mongoose';

export interface IService extends Document {
	_id: string;
	name: string;
	description: string;
	users: string[];
	owner: String;
	status: string;
	createdAt: Date;
}

const serviceSchema = new mongoose.Schema<IService>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	status: { type: String, required: true, default: 'Not configured' },
	createdAt: { type: Date, required: true, default: Date.now },
});

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
