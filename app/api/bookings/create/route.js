import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await requireAuth();
    await dbConnect();
    const body = await req.json();
    const { propertyId, months } = body || {};

    if (!propertyId || !months) {
      return NextResponse.json({ message: 'Missing property or duration' }, { status: 400 });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    const amount = property.price * parseInt(months, 10);

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `${user.id}${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order, amount }, { status: 200 });
  } catch (error) {
    console.error("Razorpay API Error:", error);
    const errorMessage = error?.error?.description || error?.message || 'Server error or payment gateway configuration issue';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
