"use client"

import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"

interface DeleteDialogProps {
  recipeName: string | null
  onCancel: () => void
  onConfirm: () => void
}

/**
 * Confirmation dialog for destructive recipe deletion.
 *
 * Built on Radix AlertDialog so we get focus trap, Escape-to-close, focus
 * restoration, scroll lock, ARIA roles and `aria-describedby` for free.
 * No behavior change vs. the previous custom overlay — only polish + a11y.
 */
export function DeleteDialog({ recipeName, onCancel, onConfirm }: DeleteDialogProps) {
  const open = recipeName !== null

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel()
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <AlertDialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border bg-card p-5 shadow-2xl sm:p-6",
            "focus:outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
        >
          <AlertDialog.Title className="text-base font-semibold text-card-foreground">
            Delete recipe?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {recipeName ? `"${recipeName}" will be permanently removed.` : ""}
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <AlertDialog.Cancel
              className={cn(
                "h-11 rounded-md border px-4 text-sm font-medium text-foreground transition-colors",
                "hover:bg-accent",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                "sm:h-9"
              )}
            >
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={onConfirm}
              className={cn(
                "h-11 rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors",
                "hover:bg-destructive/90",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                "sm:h-9"
              )}
            >
              Delete
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
