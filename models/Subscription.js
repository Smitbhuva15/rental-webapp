import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  razorpaySubscriptionId: {
    type: String,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'premium',
  },
  status: {
    type: String,
    enum: ['created', 'active', 'completed', 'canceled', 'failed'],
    default: 'created',
  },
  expiryDate: {
    type: Date,
  }
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
