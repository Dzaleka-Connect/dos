import { describe, expect, it } from "vitest";
import { parseHTML } from "linkedom";
import { initWorksheet, worksheetText } from "../src/utils/startupTemplates";

describe("business worksheets", () => {
  it("exports every prompt with space for a handwritten answer", () => {
    const text = worksheetText("Plan", [
      {
        title: "Goal",
        rows: [{ label: "Target", prompt: "What will you do?" }],
      },
    ]);
    expect(text).toContain(
      "1. Goal\nTarget\nWhat will you do?\n____________________________",
    );
  });

  it("keeps typed notes in downloads and print output without interpreting HTML", () => {
    const { document, window } = parseHTML(
      `<div data-worksheet-title="Business plan"><section data-worksheet-section="Customers"><textarea id="answer-0-0" data-label="Names" data-prompt="Who buys from you?"></textarea><div data-print-answer="answer-0-0"></div></section><a data-worksheet-download href="/blank.txt"></a><div data-worksheet-js hidden></div></div>`,
    );
    const root = document.querySelector<HTMLElement>("[data-worksheet-title]")!;
    const input = root.querySelector("textarea")!;
    const link = root.querySelector("a")!;
    const print = root.querySelector("[data-print-answer]")!;
    initWorksheet(root);
    input.value = "Café & market\n<script>private notes</script>";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    const output = decodeURIComponent(
      link.getAttribute("href")!.split(",").slice(1).join(","),
    );
    expect(output).toContain("Café & market\n<script>private notes</script>");
    expect(print.textContent).toBe(input.value);
    expect(print.querySelector("script")).toBeNull();
    expect(root.querySelector<HTMLElement>("[data-worksheet-js]")!.hidden).toBe(
      false,
    );
    input.value = "";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    expect(decodeURIComponent(link.getAttribute("href")!)).not.toContain(
      "private notes",
    );
    expect(print.textContent).toBe("");
  });
});
