import React, { useEffect, useRef } from "react";
import { CloseIcon } from "./icons";
import "./Dialog.css";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Handle dialog events
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      if (!closeOnEsc) {
        event.preventDefault();
        return;
      }
      onClose();
    };

    const handleClick = (event: MouseEvent) => {
      if (!closeOnBackdropClick) return;

      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    };

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);
    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose, closeOnEsc, closeOnBackdropClick]);

  return (
    <dialog
      ref={dialogRef}
      className={`
        p-0
        max-w-md
        w-full
        max-h-[90vh]
        rounded-xl
        shadow-lg
        border-0
        backdrop:bg-black/9
        backdrop:bg-opacity-50
        backdrop:backdrop-blur-sm
        open:animate-bounce-in
        origin-center
        ${className}
      `}
      aria-labelledby={title ? "dialog-title" : undefined}
    >
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2
                id="dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close"
                type="button"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </dialog>
  );
};
