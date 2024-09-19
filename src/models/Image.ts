import mongoose, { Document } from 'mongoose';

export interface IImage extends Document {
	_id: string;
	id: string;
	name: string;
	size: number;
	createdAt: Date;
}

const imageSchema = new mongoose.Schema<IImage>({
	id: { type: String, required: true },
	name: { type: String, required: true },
	size: { type: Number, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
});

export const Image = mongoose.models.Image || mongoose.model<IImage>('Image', imageSchema);
