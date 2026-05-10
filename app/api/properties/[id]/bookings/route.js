import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Fetch all bookings for this property that are not canceled
    const bookings = await Booking.find({
      propertyId: id,
      status: { $ne: 'canceled' }
    }).select('startDate endDate');

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching property bookings:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
