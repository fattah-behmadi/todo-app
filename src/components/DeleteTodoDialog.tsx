import React from "react";
import { Dialog } from "./Dialog";
import { Todo } from "../types/todo.types";
import { WarningIcon } from "./icons";

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
      title="Delete Todo"
      showCloseButton={true}
      closeOnBackdropClick={!isLoading}
      closeOnEsc={!isLoading}
      className="max-w-sm"
    >
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center">
            <WarningIcon className="w-6 h-6 text-danger-600" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-gray-900 font-medium">
            Are you sure you want to delete this Todo?
          </p>
          {todo && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-600 break-words">
                <span className="font-medium">"{todo.todo}"</span>
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 btn-danger relative"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Delete</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
