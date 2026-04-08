import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { requireAdmin } from '@/lib/auth';

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
    await requireAdmin();
    await dbConnect();
    const { id } = await params;
    
    // We are expecting JSON here for simple edits (no new images for simplicity)
    const body = await req.json();
    
    const property = await Property.findByIdAndUpdate(id, body, { new: true });
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await params;
    
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}
