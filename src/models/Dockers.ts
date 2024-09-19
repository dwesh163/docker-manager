import mongoose, { Document } from 'mongoose';

export interface IDocker extends Document {
	_id: string;
	name: string;
	image: string;
	status: string;
}

const dockerSchema = new mongoose.Schema<IDocker>({
	name: { type: String, required: true },
	image: { type: String, required: true },
	status: { type: String, required: true },
});

export const Docker = mongoose.models.Docker || mongoose.model<IDocker>('Docker', dockerSchema);
