// lib/models/setting.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the structure of the Setting document
export interface ISetting extends Document {
  key: string;
  value: string;
}

const SettingSchema: Schema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

// This prevents Mongoose from redefining the model every time in a serverless environment
const Setting = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default Setting;