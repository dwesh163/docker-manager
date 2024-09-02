import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
	name: string;
	username?: string;
	image?: string;
	email: string;
	password: string;
	twoFactorEnabled: boolean;
	twoFactorSecret?: string;
}

const userSchema = new mongoose.Schema<IUser>({
	name: { type: String, required: true },
	username: { type: String, required: false },
	image: { type: String, required: false },
	email: { type: String, required: true },
	password: { type: String, required: true },
	twoFactorEnabled: { type: Boolean, required: false, default: false },
	twoFactorSecret: { type: String, required: false },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
