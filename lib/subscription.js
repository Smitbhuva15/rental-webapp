export function isSubscriptionActive(user) {
  if (!user || !user.subscription || user.subscription.status !== 'active') {
    return false;
  }

  const expiry = new Date(user.subscription.expiryDate);
  const now = new Date();

  return expiry > now;
}

export function getDaysRemaining(user) {
  if (!user || !user.subscription || user.subscription.status !== 'active') {
    return 0;
  }

  const expiry = new Date(user.subscription.expiryDate);
  const now = new Date();
  
  if (expiry <= now) return 0;

  const diffTime = Math.abs(expiry - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
}
