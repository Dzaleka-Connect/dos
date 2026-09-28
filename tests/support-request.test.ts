import { describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { initSupportRequest } from "../src/utils/supportRequest";

function setup(send: typeof fetch) {
  const { document, window } = parseHTML(
    '<div><form action="https://formcarry.com/s/w40iBX_iU0b"><input name="name" value="Test"><input name="email" value="test@example.com"><input name="category" value="Website problem"><textarea name="message">Keep my message</textarea><button type="submit">Send message</button><p data-support-error hidden></p></form><p data-support-success hidden></p></div>',
  );
  const root = document.querySelector<HTMLElement>("div")!;
  const form = root.querySelector<HTMLFormElement>("form")!;
  initSupportRequest(root, send);
  return {
    root,
    form,
    submit: () =>
      form.dispatchEvent(new window.Event("submit", { cancelable: true })),
  };
}

describe("help desk submission", () => {
  it("sends one request and only shows success after acceptance", async () => {
    let resolveRequest: (response: Response) => void = () => {};
    const send = vi.fn<typeof fetch>().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const ui = setup(send);
    ui.submit();
    ui.submit();
    expect(send).toHaveBeenCalledOnce();
    expect(
      ui.root.querySelector<HTMLElement>("[data-support-success]")!.hidden,
    ).toBe(true);
    const body = send.mock.calls[0][1]?.body as URLSearchParams;
    expect(body.get("message")).toBe("Keep my message");
    expect(body.get("category")).toBe("Website problem");
    expect(body.get("_replyto")).toBe("test@example.com");
    resolveRequest(new Response(null, { status: 200 }));
    await vi.waitFor(() => expect(ui.form.hidden).toBe(true));
    expect(
      ui.root.querySelector<HTMLElement>("[data-support-success]")!.hidden,
    ).toBe(false);
  });
  it("preserves answers on error and allows a retry", async () => {
    const send = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const ui = setup(send);
    ui.submit();
    await vi.waitFor(() =>
      expect(
        ui.root.querySelector<HTMLElement>("[data-support-error]")!.hidden,
      ).toBe(false),
    );
    expect(ui.form.querySelector("textarea")!.value).toBe("Keep my message");
    expect(ui.form.querySelector("button")!.disabled).toBe(false);
    ui.submit();
    await vi.waitFor(() => expect(ui.form.hidden).toBe(true));
    expect(send).toHaveBeenCalledTimes(2);
  });
});
