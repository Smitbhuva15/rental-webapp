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

    const propertyIdStr = propertyId.toString();
    const isSaved = user.savedProperties.some(id => id.toString() === propertyIdStr);
    
    if (isSaved) {
      // Remove from saved
      user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyIdStr);
    } else {
      // Add to saved
      user.savedProperties.push(propertyIdStr);
    }

    await user.save();

    return NextResponse.json({ 
      success: true, 
      isSaved: !isSaved,
      savedProperties: user.savedProperties.map(id => id.toString())
    }, { status: 200 });
    
  } catch (error) {
    console.error('Save property error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
