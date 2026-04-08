import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await requireAuth();
    await dbConnect();
    
    // Admin sees all, User sees their own
    const query = user.role === 'Admin' ? {} : { userId: user.id };
    const bookings = await Booking.find(query)
      .populate('propertyId', 'title location images price')
      .populate('userId', 'name email');

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requireAuth();
    await dbConnect();

    const body = await req.json();
    const { propertyId, startDate, endDate } = body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getTime() - start.getTime()) / (1000 * 3600 * 24 * 30);
    const totalPrice = property.price * Math.max(1, Math.ceil(months));

    const booking = await Booking.create({
      userId: user.id,
      propertyId,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'pending' // normally would go to payment flow for rent advance
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}
