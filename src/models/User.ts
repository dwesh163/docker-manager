import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
	_id: string;
	name: string;
	username?: string;
	image?: string;
	email: string;
	password?: string;
	role: string;
	twoFactorEnabled: boolean;
	twoFactorSecret?: string;
}

const userSchema = new mongoose.Schema<IUser>({
	name: { type: String, required: true },
	username: { type: String, required: false },
	image: { type: String, required: false },
	email: { type: String, required: true },
	password: { type: String, required: false },
	role: { type: String, required: false, default: 'denied' },
	twoFactorEnabled: { type: Boolean, required: true, default: false },
	twoFactorSecret: { type: String, required: false },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
