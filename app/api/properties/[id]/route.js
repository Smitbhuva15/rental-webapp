import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const property = await Property.findById(id).populate('ownerId', 'name email');
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const sessionUser = authResult.user;

    await dbConnect();
    const { id } = await params;
    
    let property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    const user = await User.findById(sessionUser.id);
    if (user.role !== 'Admin') {
      if (user.subscription?.status !== 'active') {
        return NextResponse.json({ message: 'Forbidden: Active subscription required' }, { status: 403 });
      }
      if (property.ownerId.toString() !== sessionUser.id) {
        return NextResponse.json({ message: 'Forbidden: You do not own this property' }, { status: 403 });
      }
    }
    
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const price = formData.get('price');
    const category = formData.get('category');
    const address = formData.get('location.address');
    const city = formData.get('location.city');
    const state = formData.get('location.state');
    const bedrooms = formData.get('bedrooms');
    const bathrooms = formData.get('bathrooms');
    const area = formData.get('area');
    const amenities = formData.getAll('amenities');
    const hasNewFiles = formData.get('hasNewFiles') === 'true';

    let images = property.images;

    if (hasNewFiles) {
      const { v2: cloudinary } = await import('cloudinary');
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const imageFiles = formData.getAll('images');
      const uploadPromises = imageFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'rental_properties' },
            (error, result) => {
              if (error) reject(error);
              else resolve({ url: result.secure_url, public_id: result.public_id });
            }
          ).end(buffer);
        });
      });

      images = await Promise.all(uploadPromises);
    }

    const updateData = {
      title,
      description,
      price: Number(price),
      category,
      location: { address, city, state },
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      amenities,
      images
    };
    
    property = await Property.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const sessionUser = authResult.user;

    await dbConnect();
    const { id } = await params;
    
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    const user = await User.findById(sessionUser.id);
    if (user.role !== 'Admin') {
      if (user.subscription?.status !== 'active') {
        return NextResponse.json({ message: 'Forbidden: Active subscription required' }, { status: 403 });
      }
      if (property.ownerId.toString() !== sessionUser.id) {
        return NextResponse.json({ message: 'Forbidden: You do not own this property' }, { status: 403 });
      }
    }
    
    await Property.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}
