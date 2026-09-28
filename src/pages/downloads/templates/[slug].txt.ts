import { getCollection, type CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";
import { worksheetText } from "../../../utils/startupTemplates";

export const prerender = true;

export async function getStaticPaths() {
  return (await getCollection("startup-templates")).map((template) => ({
    params: { slug: template.id },
    props: { template },
  }));
}

export const GET: APIRoute<{
  template: CollectionEntry<"startup-templates">;
}> = ({ props }) => {
  const { template } = props;
  return new Response(
    worksheetText(template.data.title, template.data.sections),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${template.id}.txt"`,
        "X-Robots-Tag": "noindex",
      },
    },
  );
};
