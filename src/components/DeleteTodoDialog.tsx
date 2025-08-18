import React from "react";
import { Dialog } from "./Dialog";
import { Todo } from "../types/todo";

export interface DeleteTodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  todo: Todo | null;
  isLoading?: boolean;
}

export const DeleteTodoDialog: React.FC<DeleteTodoDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  todo,
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="حذف Todo"
      showCloseButton={true}
      closeOnBackdropClick={!isLoading}
      closeOnEsc={!isLoading}
      className="max-w-sm"
    >
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-danger-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-gray-900 font-medium">
            آیا مطمئن هستید که می‌خواهید این Todo را حذف کنید؟
          </p>
          {todo && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-600 break-words">
                <span className="font-medium">"{todo.todo}"</span>
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500">این عمل قابل بازگشت نیست.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 space-x-3 space-x-reverse pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 btn-secondary"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 btn-danger relative"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">حذف</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              "حذف"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
