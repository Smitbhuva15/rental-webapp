import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await requireAuth();
    await dbConnect();
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified
      const sub = await Subscription.findById(subscriptionId);
      if (!sub) return NextResponse.json({ message: 'Subscription record not found' }, { status: 404 });

      sub.razorpayPaymentId = razorpay_payment_id;
      sub.status = 'active';
      
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1); // 1 month premium
      sub.expiryDate = expiry;
      await sub.save();

      // Update User Record
      const userData = await User.findById(user.id);
      userData.subscription = {
        status: 'active',
        plan: 'premium',
        expiryDate: expiry
      };
      await userData.save();

      return NextResponse.json({ message: 'Payment verified successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}
