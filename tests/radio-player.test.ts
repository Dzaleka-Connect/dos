import { afterEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { initRadioPlayer } from "../src/utils/radioPlayer";

function setup(play = vi.fn().mockResolvedValue(undefined)) {
  const { document, window } = parseHTML(
    `<section data-radio><audio src="https://stream.example/live" controls></audio><p data-radio-status></p><div data-radio-controls hidden class="hidden"><button data-radio-toggle><span data-radio-label></span></button><button data-radio-mute></button><input data-radio-volume type="range" value="100" /></div></section>`,
  );
  const root = document.querySelector("section")!;
  const audio = document.querySelector("audio")! as unknown as HTMLAudioElement;
  audio.play = play;
  audio.pause = vi.fn();
  audio.load = vi.fn();
  audio.volume = 1;
  audio.muted = false;
  initRadioPlayer(root as unknown as HTMLElement);
  const click = () =>
    document.querySelector<HTMLButtonElement>("[data-radio-toggle]")!.click();
  const emit = (name: string) => audio.dispatchEvent(new window.Event(name));
  const status = () =>
    document.querySelector("[data-radio-status]")!.textContent;
  return { root, audio, document, window, click, emit, status, play };
}

afterEach(() => vi.useRealTimers());

describe("Yetu live player", () => {
  it("waits for actual playback and releases the stream on stop", async () => {
    vi.useFakeTimers();
    const { root, audio, click, emit, play } = setup();
    expect(play).not.toHaveBeenCalled();
    click();
    await Promise.resolve();
    expect(root.dataset.playback).toBe("connecting");
    emit("playing");
    expect(root.dataset.playback).toBe("playing");
    vi.advanceTimersByTime(30000);
    expect(root.dataset.playback).toBe("playing");
    click();
    expect(root.dataset.playback).toBe("stopped");
    expect(audio.hasAttribute("src")).toBe(false);
    expect(audio.pause).toHaveBeenCalled();
    expect(audio.load).toHaveBeenCalled();
  });

  it("times out a stalled connection and supports a fresh retry", () => {
    vi.useFakeTimers();
    const { root, click, emit, play, status } = setup();
    click();
    vi.advanceTimersByTime(15000);
    emit("stalled");
    vi.advanceTimersByTime(10000);
    expect(root.dataset.playback).toBe("error");
    expect(status()).toContain("did not respond");
    click();
    expect(play).toHaveBeenCalledTimes(2);
    emit("playing");
    expect(root.dataset.playback).toBe("playing");
    emit("waiting");
    vi.advanceTimersByTime(25000);
    expect(root.dataset.playback).toBe("error");
  });

  it("ignores a cancelled attempt rejecting after a successful retry", async () => {
    vi.useFakeTimers();
    let rejectFirst!: (reason: Error) => void;
    const play = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((_resolve, reject) => {
            rejectFirst = reject;
          }),
      )
      .mockResolvedValue(undefined);
    const { root, click, emit } = setup(play);
    click();
    click();
    click();
    emit("playing");
    rejectFirst(new Error("Aborted previous connection"));
    await Promise.resolve();
    expect(root.dataset.playback).toBe("playing");
  });

  it("reports blocked playback and stream errors without claiming it is playing", async () => {
    vi.useFakeTimers();
    const error = new Error("Playback blocked");
    error.name = "NotAllowedError";
    const { root, click, emit, status } = setup(
      vi.fn().mockRejectedValueOnce(error).mockResolvedValue(undefined),
    );
    click();
    await Promise.resolve();
    expect(root.dataset.playback).toBe("error");
    expect(status()).toContain("browser blocked");
    click();
    emit("error");
    emit("pause");
    expect(root.dataset.playback).toBe("error");
    expect(status()).toContain("stream is unavailable");
  });

  it("keeps mute and volume controls in sync with the media element", () => {
    const { audio, document, window } = setup();
    const mute =
      document.querySelector<HTMLButtonElement>("[data-radio-mute]")!;
    mute.click();
    expect(audio.muted).toBe(true);
    expect(mute.textContent).toBe("Unmute");
    const volume = document.querySelector<HTMLInputElement>(
      "[data-radio-volume]",
    )!;
    volume.value = "45";
    volume.dispatchEvent(new window.Event("input"));
    expect(audio.volume).toBe(0.45);
    expect(audio.muted).toBe(false);
    expect(mute.textContent).toBe("Mute");
  });
});
