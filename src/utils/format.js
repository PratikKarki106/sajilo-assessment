export function getFullName(user) {
  if (!user) return 'Unknown user';
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown user';
}

export function formatLabel(value) {
  if (!value) return '—';
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatAddress(address) {
  if (!address) return '—';
  return [address.address, address.city, address.state, address.postalCode, address.country]
    .filter(Boolean)
    .join(', ');
}

export function maskCardNumber(cardNumber) {
  if (!cardNumber) return '—';
  const digits = String(cardNumber).replace(/\s/g, '');
  if (digits.length < 4) return '••••';
  return `•••• •••• •••• ${digits.slice(-4)}`;
}
