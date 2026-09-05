export function registrationPayload(data: FormData) {
  const payload: Record<string, string | string[]> = {};
  for (const [key, value] of data.entries()) {
    if (typeof value === 'string' && key !== 'availability') payload[key] = value;
  }
  payload.availability = data.getAll('availability').filter((value): value is string => typeof value === 'string');
  return payload;
}

export function logoValidationError(file: { type: string; size: number }) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Choose a JPG, PNG or WebP image.';
  if (file.size > 2 * 1024 * 1024) return 'Choose an image smaller than 2 MB.';
  return '';
}
