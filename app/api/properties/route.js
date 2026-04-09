import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const q = searchParams.get('q'); // text search

    let query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { 'location.city': { $regex: q, $options: 'i' } },
      ];
    }

    const properties = await Property.find(query).populate('ownerId', 'name email');
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const sessionUser = await requireAuth();
    await dbConnect();
    const user = await User.findById(sessionUser.id);

    if (user.role !== 'Admin' && user.subscription?.status !== 'active') {
      return NextResponse.json({ message: 'Forbidden: Active subscription required' }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const price = formData.get('price');
    const category = formData.get('category');
    const address = formData.get('location.address');
    const city = formData.get('location.city');
    const state = formData.get('location.state');

    // Handle files
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

    const uploadedImages = await Promise.all(uploadPromises);

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      category,
      location: { address, city, state },
      ownerId: user.id,
      images: uploadedImages,
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ message: 'Server error or unauthorized', error: error.message }, { status: 500 });
  }
}
