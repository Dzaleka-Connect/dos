import { useEffect, useRef, type ReactNode } from 'react';
export default function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => previous?.focus();
  }, []);
  return <dialog ref={dialog} aria-label={label} onCancel={(event) => { event.preventDefault(); onClose(); }} className="max-h-[calc(100dvh-2rem)] w-[min(48rem,calc(100%-2rem))] max-w-none overflow-y-auto rounded border border-slate-300 bg-white p-0 text-slate-900 backdrop:bg-slate-950/50">{children}</dialog>;
}
