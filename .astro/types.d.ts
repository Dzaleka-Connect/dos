declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"events-guide.md": {
	id: "events-guide.md";
  slug: "events-guide";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"getting-started.md": {
	id: "getting-started.md";
  slug: "getting-started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"photo-archive.md": {
	id: "photo-archive.md";
  slug: "photo-archive";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"resources-guide.md": {
	id: "resources-guide.md";
  slug: "resources-guide";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"services-directory.md": {
	id: "services-directory.md";
  slug: "services-directory";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"services-guide.md": {
	id: "services-guide.md";
  slug: "services-guide";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
};
"events": {
"art-exhibition-2024.md": {
	id: "art-exhibition-2024.md";
  slug: "art-exhibition-2024";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"cultural-dance-showcase.md": {
	id: "cultural-dance-showcase.md";
  slug: "cultural-dance-showcase";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"tumaini-festival-2023.md": {
	id: "tumaini-festival-2023.md";
  slug: "tumaini-festival-2023";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"world-refugee-day-2023.md": {
	id: "world-refugee-day-2023.md";
  slug: "world-refugee-day-2023";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"youth-empowerment-workshop-2024.md": {
	id: "youth-empowerment-workshop-2024.md";
  slug: "youth-empowerment-workshop-2024";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"youth-tech-workshop-2024.md": {
	id: "youth-tech-workshop-2024.md";
  slug: "youth-tech-workshop-2024";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
};
"news": {
"community-center-renovation.md": {
	id: "community-center-renovation.md";
  slug: "community-center-renovation";
  body: string;
  collection: "news";
  data: InferEntrySchema<"news">
} & { render(): Render[".md"] };
"dzaleka-artisans-cooperative-launch.md": {
	id: "dzaleka-artisans-cooperative-launch.md";
  slug: "dzaleka-artisans-cooperative-launch";
  body: string;
  collection: "news";
  data: InferEntrySchema<"news">
} & { render(): Render[".md"] };
"tech-startup-success.md": {
	id: "tech-startup-success.md";
  slug: "tech-startup-success";
  body: string;
  collection: "news";
  data: InferEntrySchema<"news">
} & { render(): Render[".md"] };
};
"pages": {
"about.md": {
	id: "about.md";
  slug: "about";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"events.md": {
	id: "events.md";
  slug: "events";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"home.md": {
	id: "home.md";
  slug: "home";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"virtual-tours.md": {
	id: "virtual-tours.md";
  slug: "virtual-tours";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
};
"photos": {
"Andy.md": {
	id: "Andy.md";
  slug: "andy";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"Junior-Mafia.md": {
	id: "Junior-Mafia.md";
  slug: "junior-mafia";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"La-Pearl-DJ.md": {
	id: "La-Pearl-DJ.md";
  slug: "la-pearl-dj";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"Learning-Against-All-Odds.md": {
	id: "Learning-Against-All-Odds.md";
  slug: "learning-against-all-odds";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"Obadiah.md": {
	id: "Obadiah.md";
  slug: "obadiah";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"Raymond.md": {
	id: "Raymond.md";
  slug: "raymond";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"Surviving-in-Dzaleka.md": {
	id: "Surviving-in-Dzaleka.md";
  slug: "surviving-in-dzaleka";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"a-man-collecting-cardboard.md": {
	id: "a-man-collecting-cardboard.md";
  slug: "a-man-collecting-cardboard";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"building-hope.md": {
	id: "building-hope.md";
  slug: "building-hope";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"living-hope.md": {
	id: "living-hope.md";
  slug: "living-hope";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"stepping-out-of-my-comfort.md": {
	id: "stepping-out-of-my-comfort.md";
  slug: "stepping-out-of-my-comfort";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"stitching-sisterhood.md": {
	id: "stitching-sisterhood.md";
  slug: "stitching-sisterhood";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"struggling-to-feed-a-community.md": {
	id: "struggling-to-feed-a-community.md";
  slug: "struggling-to-feed-a-community";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"the-first-of-my-kind.md": {
	id: "the-first-of-my-kind.md";
  slug: "the-first-of-my-kind";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
"tumaini-festival-2023.md": {
	id: "tumaini-festival-2023.md";
  slug: "tumaini-festival-2023";
  body: string;
  collection: "photos";
  data: InferEntrySchema<"photos">
} & { render(): Render[".md"] };
};
"resources": {
"business-plan-template.md": {
	id: "business-plan-template.md";
  slug: "business-plan-template";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
"cv-writing-guide.md": {
	id: "cv-writing-guide.md";
  slug: "cv-writing-guide";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
"digital-marketing-course.md": {
	id: "digital-marketing-course.md";
  slug: "digital-marketing-course";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
"glimpse-into-dzaleka-life.md": {
	id: "glimpse-into-dzaleka-life.md";
  slug: "glimpse-into-dzaleka-life";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
"malawi-refugee-guide.md": {
	id: "malawi-refugee-guide.md";
  slug: "malawi-refugee-guide";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
"refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md": {
	id: "refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md";
  slug: "refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
"research-report-refugee-relocation-intentions.md": {
	id: "research-report-refugee-relocation-intentions.md";
  slug: "research-report-refugee-relocation-intentions";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
"tumaini-impact-2019.md": {
	id: "tumaini-impact-2019.md";
  slug: "tumaini-impact-2019";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
"tumaini-impact-2020.md": {
	id: "tumaini-impact-2020.md";
  slug: "tumaini-impact-2020";
  body: string;
  collection: "resources";
  data: InferEntrySchema<"resources">
} & { render(): Render[".md"] };
};
"services": {
"adai-circle.md": {
	id: "adai-circle.md";
  slug: "adai-circle";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"ate-hub.md": {
	id: "ate-hub.md";
  slug: "ate-hub";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-art-project.md": {
	id: "dzaleka-art-project.md";
  slug: "dzaleka-art-project";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-art-slab.md": {
	id: "dzaleka-art-slab.md";
  slug: "dzaleka-art-slab";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-blood-donors-services.md": {
	id: "dzaleka-blood-donors-services.md";
  slug: "dzaleka-blood-donors-services";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-community-radio.md": {
	id: "dzaleka-community-radio.md";
  slug: "dzaleka-community-radio";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-connect.md": {
	id: "dzaleka-connect.md";
  slug: "dzaleka-connect";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-digital-heritage.md": {
	id: "dzaleka-digital-heritage.md";
  slug: "dzaleka-digital-heritage";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-rising.md": {
	id: "dzaleka-rising.md";
  slug: "dzaleka-rising";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-watch.md": {
	id: "dzaleka-watch.md";
  slug: "dzaleka-watch";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"dzaleka-youth-organization.md": {
	id: "dzaleka-youth-organization.md";
  slug: "dzaleka-youth-organization";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"fountain-of-hope-africa.md": {
	id: "fountain-of-hope-africa.md";
  slug: "fountain-of-hope-africa";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"fraternity-without-borders.md": {
	id: "fraternity-without-borders.md";
  slug: "fraternity-without-borders";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"green-uhuru-organization.md": {
	id: "green-uhuru-organization.md";
  slug: "green-uhuru-organization";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"home-storytellers.md": {
	id: "home-storytellers.md";
  slug: "home-storytellers";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"iafr.md": {
	id: "iafr.md";
  slug: "iafr";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"inside-dzaleka.md": {
	id: "inside-dzaleka.md";
  slug: "inside-dzaleka";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"inua-advocacy.md": {
	id: "inua-advocacy.md";
  slug: "inua-advocacy";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"jesuit-worldwide-learning.md": {
	id: "jesuit-worldwide-learning.md";
  slug: "jesuit-worldwide-learning";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"jrs-malawi.md": {
	id: "jrs-malawi.md";
  slug: "jrs-malawi";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"kibebe.md": {
	id: "kibebe.md";
  slug: "kibebe";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"plan-international-malawi.md": {
	id: "plan-international-malawi.md";
  slug: "plan-international-malawi";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"refugee-journalism-project.md": {
	id: "refugee-journalism-project.md";
  slug: "refugee-journalism-project";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"refugee-led-organisation-network-malawi.md": {
	id: "refugee-led-organisation-network-malawi.md";
  slug: "refugee-led-organisation-network-malawi";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"rock-your-world.md": {
	id: "rock-your-world.md";
  slug: "rock-your-world";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"salama-africa.md": {
	id: "salama-africa.md";
  slug: "salama-africa";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"takenolab.md": {
	id: "takenolab.md";
  slug: "takenolab";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"there-is-hope-malawi.md": {
	id: "there-is-hope-malawi.md";
  slug: "there-is-hope-malawi";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"tumaini-festival.md": {
	id: "tumaini-festival.md";
  slug: "tumaini-festival";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"tumaini-letu.md": {
	id: "tumaini-letu.md";
  slug: "tumaini-letu";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"umoja-hand-craft-project.md": {
	id: "umoja-hand-craft-project.md";
  slug: "umoja-hand-craft-project";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"unhcr-malawi.md": {
	id: "unhcr-malawi.md";
  slug: "unhcr-malawi";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"vijanafrica.md": {
	id: "vijanafrica.md";
  slug: "vijanafrica";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"village-book-builders.md": {
	id: "village-book-builders.md";
  slug: "village-book-builders";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"world-food-programme.md": {
	id: "world-food-programme.md";
  slug: "world-food-programme";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"wusc-malawi.md": {
	id: "wusc-malawi.md";
  slug: "wusc-malawi";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"ywam-dzaleka.md": {
	id: "ywam-dzaleka.md";
  slug: "ywam-dzaleka";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
"zawadie-solutions.md": {
	id: "zawadie-solutions.md";
  slug: "zawadie-solutions";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"gallery": {
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
