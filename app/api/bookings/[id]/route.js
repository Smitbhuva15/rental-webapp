import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const user = await requireAuth();
    await dbConnect();
    const { id } = await params;
    
    const body = await req.json();
    const { status } = body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (user.role !== 'Admin' && booking.userId.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    booking.status = status;
    await booking.save();

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await requireAuth();
    await dbConnect();
    const { id } = await params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (user.role !== 'Admin' && booking.userId.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await booking.deleteOne();
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}
