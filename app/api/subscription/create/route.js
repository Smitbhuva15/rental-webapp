import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await requireAuth();
    await dbConnect();
    const body = await req.json();
    const { planName } = body || {};

    let amount = 499; // Default to premium
    let finalPlan = 'premium';

    if (planName === 'basic') {
      amount = 499;
      finalPlan = 'basic';
    } else if (planName === 'premium') {
      amount = 499;
      finalPlan = 'premium';
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `${user.id}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const sub = await Subscription.create({
      userId: user.id,
      razorpayOrderId: order.id,
      plan: finalPlan,
      status: 'created'
    });

    return NextResponse.json({ order, subscriptionId: sub._id, plan: finalPlan }, { status: 200 });
  } catch (error) {
    console.error("Razorpay API Error:", error);
    
    // Extract actual error message from Razorpay API error object
    const errorMessage = error?.error?.description || error?.message || 'Server error or payment gateway configuration issue';
    
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
