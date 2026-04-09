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
    const sessionUser = await requireAuth();
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
    
    // We are expecting JSON here for simple edits (no new images for simplicity)
    const body = await req.json();
    
    property = await Property.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const sessionUser = await requireAuth();
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
