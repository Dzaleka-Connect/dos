/** Legacy directory placeholders are not the identity of a service provider. */
export function providerLogo(title: string, logo?: string): string | undefined {
  if (!logo) return undefined;
  const isPlaceholder = /\/dzaleka[- ]digital[- ]heritage\.png$/i.test(logo.replace(/%20/g, ' '));
  return isPlaceholder && !/dzaleka digital heritage/i.test(title) ? undefined : logo;
}
