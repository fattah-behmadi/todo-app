import React from "react";
import { Dialog } from "./Dialog";
import { Todo } from "../types/todo.types";
import { WarningIcon } from "./icons";
import { Button } from "./base";

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
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="secondary"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant="danger"
            loading={isLoading}
            fullWidth
          >
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
