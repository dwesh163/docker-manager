import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
	provider: String,
	name: String,
	email: String,
	image: String,
	password: String,
	username: String,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
