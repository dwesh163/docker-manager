import mongoose, { Document } from 'mongoose';

export interface INetwork extends Document {
	_id: string;
	id: string;
	name: string;
	createdAt: Date;
}

const networkSchema = new mongoose.Schema<INetwork>({
	id: { type: String, required: true },
	name: { type: String, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
});

export const Network = mongoose.models.Network || mongoose.model<INetwork>('Network', networkSchema);
