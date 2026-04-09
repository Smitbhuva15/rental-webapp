import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await requireAuth();
    await dbConnect();
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, propertyId, startDate, months, amount } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified
      
      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + parseInt(months, 10));

      const booking = await Booking.create({
        userId: user.id,
        propertyId,
        paymentId: razorpay_payment_id,
        startDate: start,
        endDate: end,
        status: 'confirmed',
        totalPrice: amount
      });

      return NextResponse.json({ message: 'Payment verified successfully', booking }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error or unauthorized' }, { status: 500 });
  }
}
