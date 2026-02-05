import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  status: 'success' | 'failure';
  ipAddress: string;
  userAgent: string;
  metadata?: any;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'LOGIN', 'PASSWORD_RESET', 'USER_UPDATE'
  resource: { type: String, required: true }, // e.g., 'AUTH', 'USER'
  status: { type: String, enum: ['success', 'failure'], required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
