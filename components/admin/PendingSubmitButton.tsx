
"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  pendingText: string;
  className: string;
  disabled?: boolean;
};

export default function PendingSubmitButton({
  children,
  pendingText,
  className,
  disabled = false,
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={className}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
