import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await requireAuth();
    await dbConnect();
    
    // Create an order instead of a subscription for simplicity and standard payments. 
    // Subscriptions via Razorpay require predefined plans on the Razorpay dashboard.
    // For this context, let's assume we are buying a month of 'premium' access via orders.
    const options = {
      amount: 499 * 100, // 499 INR
      currency: "INR",
      receipt: `receipt_${user.id}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const sub = await Subscription.create({
      userId: user.id,
      razorpayOrderId: order.id,
      plan: 'premium',
      status: 'created'
    });

    return NextResponse.json({ order, subscriptionId: sub._id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}
