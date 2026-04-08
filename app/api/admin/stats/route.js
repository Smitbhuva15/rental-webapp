import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();

    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'confirmed'] } });

    return NextResponse.json({
      totalUsers,
      totalProperties,
      activeBookings,
    }, { status: 200 });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ message: 'Unauthorized or Server Error' }, { status: 500 });
  }
}
