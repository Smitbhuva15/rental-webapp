import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();

    const properties = await Property.find({}).populate('ownerId', 'name email').sort({ createdAt: -1 });

    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error('Admin properties error:', error);
    return NextResponse.json({ message: 'Unauthorized or Server Error' }, { status: 500 });
  }
}
