import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
