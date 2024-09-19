import mongoose, { Document } from 'mongoose';

export interface IDocker extends Document {
	_id: string;
	name: string;
	image: string;
	status: string;
	currentStatus: string;
	startedAt: Date;
}

const dockerSchema = new mongoose.Schema<IDocker>({
	name: { type: String, required: true },
	image: { type: String, required: true },
	status: { type: String, required: true },
	currentStatus: { type: String, required: true },
	startedAt: { type: Date, required: true, default: Date.now },
});

export const Docker = mongoose.models.Docker || mongoose.model<IDocker>('Docker', dockerSchema);
