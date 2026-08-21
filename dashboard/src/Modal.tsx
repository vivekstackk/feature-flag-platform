import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({
  title,
  onClose,
  children,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-text-dim">
              Configuration
            </div>

            <h2 className="mt-1 text-sm font-medium">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center border border-border text-text-dim hover:border-text-dim hover:text-text"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}