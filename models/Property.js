import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the property'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price per month'],
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
  },
  category: {
    type: String,
    enum: ['Apartment', 'House', 'Villa', 'Commercial', 'Room'],
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [{
    url: String,
    public_id: String
  }],
  amenities: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);
