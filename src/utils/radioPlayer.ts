type PlaybackState =
  "idle" | "connecting" | "playing" | "buffering" | "stopped" | "error";

export function initRadioPlayer(root: HTMLElement) {
  const audio = root.querySelector<HTMLAudioElement>("audio");
  const controls = root.querySelector<HTMLElement>("[data-radio-controls]");
  const toggle = root.querySelector<HTMLButtonElement>("[data-radio-toggle]");
  const label = root.querySelector<HTMLElement>("[data-radio-label]");
  const status = root.querySelector<HTMLElement>("[data-radio-status]");
  const volume = root.querySelector<HTMLInputElement>("[data-radio-volume]");
  const mute = root.querySelector<HTMLButtonElement>("[data-radio-mute]");
  const source = audio?.getAttribute("src");
  if (
    !audio ||
    !controls ||
    !toggle ||
    !label ||
    !status ||
    !volume ||
    !mute ||
    !source
  )
    return;

  let state: PlaybackState = "idle";
  let wanted = false;
  let attempt = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const clearTimeoutIfSet = () => {
    clearTimeout(timeout);
    timeout = undefined;
  };
  const render = (next: PlaybackState, message: string) => {
    state = next;
    root.dataset.playback = state;
    status.textContent = message;
    label.textContent =
      state === "playing" || state === "buffering"
        ? "Stop listening"
        : state === "connecting"
          ? "Cancel connection"
          : state === "error"
            ? "Try again"
            : "Listen live";
    root
      .querySelector("[data-radio-play-icon]")
      ?.classList.toggle("hidden", wanted);
    root
      .querySelector("[data-radio-stop-icon]")
      ?.classList.toggle("hidden", !wanted);
  };
  const release = () => {
    wanted = false;
    attempt++;
    clearTimeoutIfSet();
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  };
  const fail = (
    message = "The stream is unavailable or the connection was lost. Try again, or use the station website below.",
  ) => {
    release();
    render("error", message);
  };
  const armTimeout = () => {
    if (!timeout)
      timeout = setTimeout(
        () =>
          fail(
            "The station did not respond in time. Try again, or use the station website below.",
          ),
        25000,
      );
  };
  toggle.addEventListener("click", async () => {
    if (wanted) {
      release();
      render(
        "stopped",
        "Stopped. Press Listen live to reconnect to the broadcast.",
      );
      return;
    }
    wanted = true;
    const currentAttempt = ++attempt;
    audio.src = source;
    render("connecting", "Connecting to Yetu Radio…");
    armTimeout();
    try {
      await audio.play();
    } catch (error) {
      if (!wanted || currentAttempt !== attempt) return;
      fail(
        error instanceof Error && error.name === "NotAllowedError"
          ? "Your browser blocked playback. Press Try again to start the audio."
          : undefined,
      );
    }
  });
  audio.addEventListener("playing", () => {
    if (!wanted) return;
    clearTimeoutIfSet();
    render("playing", "Playing Yetu Radio.");
  });
  for (const event of ["waiting", "stalled"])
    audio.addEventListener(event, () => {
      if (!wanted) return;
      render(
        state === "connecting" ? "connecting" : "buffering",
        "Waiting for audio from the station…",
      );
      armTimeout();
    });
  audio.addEventListener("error", () => {
    if (wanted) fail();
  });
  audio.addEventListener("ended", () => {
    if (wanted)
      fail("The broadcast connection ended. Press Try again to reconnect.");
  });
  audio.addEventListener("pause", () => {
    if (wanted && audio.paused) {
      release();
      render("stopped", "Playback paused. Press Listen live to reconnect.");
    }
  });
  const syncVolume = () => {
    volume.value = String(Math.round(audio.volume * 100));
    mute.textContent = audio.muted ? "Unmute" : "Mute";
  };
  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value) / 100;
    if (audio.volume > 0) audio.muted = false;
    syncVolume();
  });
  mute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    syncVolume();
  });
  audio.addEventListener("volumechange", syncVolume);
  syncVolume();
  controls.hidden = false;
  controls.classList.remove("hidden");
  audio.controls = false;
  audio.hidden = true;
  render("idle", "Ready to connect. Audio starts when you press Listen live.");
}
