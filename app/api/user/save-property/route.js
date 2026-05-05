import { NextResponse } from 'next/server';
import {requireAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ message: 'Property ID is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(authResult.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isSaved = user.savedProperties.some(id => id.toString() === propertyId.toString());
    
    let updatedUser;
    if (isSaved) {
      updatedUser = await User.findByIdAndUpdate(
        authResult.user.id,
        { $pull: { savedProperties: propertyId } },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        authResult.user.id,
        { $addToSet: { savedProperties: propertyId } },
        { new: true }
      );
    }

    return NextResponse.json({ 
      success: true, 
      isSaved: !isSaved,
      savedProperties: updatedUser.savedProperties.map(id => id.toString())
    }, { status: 200 });
  } catch (error) {
    console.error('Save property error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
