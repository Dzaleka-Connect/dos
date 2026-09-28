export function initSupportRequest(
  root: HTMLElement,
  send: typeof fetch = fetch,
) {
  const form = root.querySelector<HTMLFormElement>("form");
  const button = root.querySelector<HTMLButtonElement>('[type="submit"]');
  const error = root.querySelector<HTMLElement>("[data-support-error]");
  const success = root.querySelector<HTMLElement>("[data-support-success]");
  if (!form || !button || !error || !success) return;
  let pending = false;
  let sent = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending || sent) return;
    const payload = new URLSearchParams();
    form
      .querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("[name]")
      .forEach((field) => payload.set(field.name, field.value));
    payload.set("_replyto", payload.get("email") || "");
    pending = true;
    button.disabled = true;
    button.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");
    error.hidden = true;
    try {
      const response = await send(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });
      if (!response.ok) throw new Error("Support request failed");
      sent = true;
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      error.hidden = false;
      error.focus();
    } finally {
      pending = false;
      button.disabled = sent;
      button.textContent = "Send message";
      form.removeAttribute("aria-busy");
    }
  });
}
