export function maskAadhaar(aadhaar: string | null | undefined): string {
  if (!aadhaar) return '';
  // Show only last 4 digits, mask the rest
  if (aadhaar.length <= 4) return aadhaar;
  return 'X'.repeat(aadhaar.length - 4) + aadhaar.slice(-4);
}

export function maskPAN(pan: string | null | undefined): string {
  if (!pan) return '';
  // Show only last 4 characters, mask the rest
  if (pan.length <= 4) return pan;
  return 'X'.repeat(pan.length - 4) + pan.slice(-4);
}
