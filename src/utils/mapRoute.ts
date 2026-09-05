import { z } from 'zod';

const routeSchema = z.object({
  code: z.literal('Ok'),
  routes: z.array(z.object({
    distance: z.number().finite().nonnegative(),
    duration: z.number().finite().nonnegative(),
    geometry: z.object({ coordinates: z.array(z.tuple([z.number().finite().min(-180).max(180), z.number().finite().min(-90).max(90)])).min(2) }),
    legs: z.array(z.object({ steps: z.array(z.object({
      name: z.string(), distance: z.number().finite().nonnegative(),
      maneuver: z.object({ type: z.string(), modifier: z.string().optional() }),
    })) })).min(1),
  })).min(1),
});

export function parseMapRoute(data: unknown) {
  const parsed = routeSchema.safeParse(data);
  if (!parsed.success) return null;
  const route = parsed.data.routes[0];
  return {
    distance: route.distance, duration: route.duration,
    coordinates: route.geometry.coordinates.map(([lng, lat]): [number, number] => [lat, lng]),
    steps: route.legs.flatMap((leg) => leg.steps),
  };
}
export type MapRoute = NonNullable<ReturnType<typeof parseMapRoute>>;
