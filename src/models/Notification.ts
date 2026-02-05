import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  target: 'all' | string; // 'all' or a specific userId
  createdBy: string;
  isReadBy: string[]; // List of user IDs who read it
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'error', 'success'], default: 'info' },
  target: { type: String, default: 'all' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isReadBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
