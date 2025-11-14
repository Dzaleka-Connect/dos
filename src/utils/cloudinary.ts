/**
 * Cloudinary image optimization utilities
 * Generates optimized image URLs with automatic format selection, quality optimization,
 * and responsive image transformations
 */

const CLOUDINARY_CLOUD_NAME = 'dcvwslmow';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Image transformation options
 */
export interface CloudinaryOptions {
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Crop mode: 'fill', 'fit', 'scale', 'crop', 'thumb', 'pad' */
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  /** Quality: 'auto', number (1-100), or 'auto:best', 'auto:good', 'auto:eco', 'auto:low' */
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  /** Format: 'auto', 'webp', 'jpg', 'png', etc. */
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
  /** Gravity for crop: 'auto', 'face', 'center', etc. */
  gravity?: 'auto' | 'face' | 'faces' | 'center' | 'north' | 'south' | 'east' | 'west';
  /** DPR (Device Pixel Ratio): 'auto', 1, 2, 3 */
  dpr?: 'auto' | number;
  /** Fetch format (f_auto) */
  fetchFormat?: boolean;
  /** Blur effect (1-2000) */
  blur?: number;
  /** Sharpen effect */
  sharpen?: boolean;
  /** Effects */
  effect?: string;
}

/**
 * Generate optimized Cloudinary image URL
 * @param publicId - Cloudinary public ID or full URL
 * @param options - Transformation options
 * @returns Optimized image URL or original URL if not from Cloudinary
 */
export function getCloudinaryUrl(publicId: string, options: CloudinaryOptions = {}): string {
  // Handle null, undefined, or empty strings
  if (!publicId || typeof publicId !== 'string') {
    return publicId || '';
  }

  // If it's already a full URL and not a Cloudinary URL, return as is
  if (publicId.startsWith('http') && !publicId.includes('cloudinary.com')) {
    return publicId;
  }

  // If it's a relative path (starts with /), return as is
  if (publicId.startsWith('/') && !publicId.includes('cloudinary')) {
    return publicId;
  }

  // Extract public ID from Cloudinary URL if provided
  let cleanPublicId = publicId;
  if (publicId.includes('cloudinary.com')) {
    const matches = publicId.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (matches && matches[1]) {
      cleanPublicId = matches[1];
    }
  }

  // Build transformation string
  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  if (options.dpr) transformations.push(`dpr_${options.dpr}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.blur) transformations.push(`e_blur:${options.blur}`);
  if (options.sharpen) transformations.push('e_sharpen');
  if (options.effect) transformations.push(`e_${options.effect}`);

  // Default optimizations
  if (options.fetchFormat !== false) {
    transformations.push('f_auto'); // Auto format selection
  } else if (options.format) {
    transformations.push(`f_${options.format}`);
  }

  const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';

  return `${CLOUDINARY_BASE_URL}/${transformString}${cleanPublicId}`;
}

/**
 * Generate responsive image srcset for Cloudinary images
 * @param publicId - Cloudinary public ID or full URL
 * @param widths - Array of widths for responsive images
 * @param options - Base transformation options
 * @returns srcset string
 */
export function getCloudinarySrcSet(
  publicId: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536],
  options: CloudinaryOptions = {}
): string {
  return widths
    .map(width => {
      const url = getCloudinaryUrl(publicId, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Preset configurations for common use cases
 */
export const CloudinaryPresets = {
  /** Thumbnail image (150x150, cropped) */
  thumbnail: (publicId: string): string =>
    getCloudinaryUrl(publicId, {
      width: 150,
      height: 150,
      crop: 'thumb',
      gravity: 'auto',
      quality: 'auto:good',
      dpr: 'auto'
    }),

  /** Card image (400x300, filled) */
  card: (publicId: string): string =>
    getCloudinaryUrl(publicId, {
      width: 400,
      height: 300,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto:good',
      dpr: 'auto'
    }),

  /** Hero image (1920x1080, filled) */
  hero: (publicId: string): string =>
    getCloudinaryUrl(publicId, {
      width: 1920,
      height: 1080,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto:best',
      dpr: 'auto'
    }),

  /** Profile image (200x200, cropped to face) */
  profile: (publicId: string): string =>
    getCloudinaryUrl(publicId, {
      width: 200,
      height: 200,
      crop: 'thumb',
      gravity: 'face',
      quality: 'auto:good',
      dpr: 'auto'
    }),

  /** Gallery image (800x600, fit) */
  gallery: (publicId: string): string =>
    getCloudinaryUrl(publicId, {
      width: 800,
      height: 600,
      crop: 'fit',
      quality: 'auto:good',
      dpr: 'auto'
    }),

  /** Logo (300px width, maintain aspect ratio) */
  logo: (publicId: string): string =>
    getCloudinaryUrl(publicId, {
      width: 300,
      crop: 'scale',
      quality: 'auto:best',
      dpr: 'auto'
    }),

  /** Optimized for web (auto format, auto quality) */
  webOptimized: (publicId: string, width?: number): string =>
    getCloudinaryUrl(publicId, {
      width,
      crop: width ? 'scale' : undefined,
      quality: 'auto',
      dpr: 'auto',
      fetchFormat: true
    })
};

/**
 * Check if a URL is a Cloudinary URL
 * @param url - URL to check
 * @returns true if URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

/**
 * Get placeholder image URL (blurred version for lazy loading)
 * @param publicId - Cloudinary public ID or full URL
 * @returns Blurred placeholder image URL or original URL if not from Cloudinary
 */
export function getPlaceholderUrl(publicId: string): string {
  // If not a Cloudinary URL, return original
  if (!publicId || !isCloudinaryUrl(publicId)) {
    return publicId;
  }

  return getCloudinaryUrl(publicId, {
    width: 50,
    quality: 'auto:low',
    blur: 1000,
    fetchFormat: true
  });
}
