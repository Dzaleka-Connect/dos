export const toolsLibrary = {
  title: "Tools and templates",
  description:
    "Business planning worksheets for Dzaleka, digital archive tools and site submission forms. Fill in a template online, download your notes or print a copy.",
  canonical: "https://services.dzaleka.com/tools-and-templates",
};

export const toolsImage =
  "https://services.dzaleka.com/images/dzaleka-hero.jpeg";
export const templatePath = (id: string) => `/tools-and-templates/${id}`;

export function toolsBreadcrumb(template?: { id: string; title: string }) {
  const items = [
    { name: "Home", item: "https://services.dzaleka.com/" },
    { name: toolsLibrary.title, item: toolsLibrary.canonical },
    ...(template
      ? [
          {
            name: template.title,
            item: new URL(templatePath(template.id), toolsLibrary.canonical)
              .href,
          },
        ]
      : []),
  ];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...item,
    })),
  };
}

export interface WorksheetSection {
  title: string;
  rows: { label: string; prompt: string; answer?: string }[];
}

export function worksheetText(
  title: string,
  sections: WorksheetSection[],
): string {
  return [
    title,
    "Dzaleka Online Services",
    "",
    ...sections.flatMap((section, index) => [
      `${index + 1}. ${section.title}`,
      ...section.rows.flatMap((row) => [
        row.label,
        row.prompt,
        row.answer?.trim() || "____________________________",
        "",
      ]),
    ]),
  ].join("\n");
}

export function initWorksheet(root: HTMLElement): void {
  if (root.dataset.ready) return;
  root.dataset.ready = "true";
  const downloadLinks = root.querySelectorAll<HTMLAnchorElement>(
    "[data-worksheet-download]",
  );
  const update = () => {
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-worksheet-section]"),
      (section) => ({
        title: section.dataset.worksheetSection || "",
        rows: Array.from(
          section.querySelectorAll<HTMLTextAreaElement>("textarea"),
          (field) => {
            const printAnswer = root.querySelector<HTMLElement>(
              `[data-print-answer="${field.id}"]`,
            );
            if (printAnswer) printAnswer.textContent = field.value;
            return {
              label: field.dataset.label || "",
              prompt: field.dataset.prompt || "",
              answer: field.value,
            };
          },
        ),
      }),
    );
    const text = worksheetText(root.dataset.worksheetTitle || "", sections);
    downloadLinks.forEach((link) => {
      link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    });
  };
  root.addEventListener("input", update);
  root
    .querySelectorAll<HTMLElement>("[data-worksheet-js]")
    .forEach((control) => {
      control.hidden = false;
    });
  root
    .querySelectorAll<HTMLButtonElement>("[data-worksheet-print]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        update();
        window.print();
      });
    });
  update();
}
