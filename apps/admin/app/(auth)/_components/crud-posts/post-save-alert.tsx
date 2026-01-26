import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui";

interface NavigationConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
}

function NavigationConfirmation({
  isOpen,
  onClose,
  onSave,
  onDiscard,
}: NavigationConfirmationProps): JSX.Element {
  return (
    <AlertDialog onOpenChange={onClose} open={isOpen}>
      <AlertDialogContent className="bg-neutral-800 text-neutral-200">
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            You have unsaved changes. Would you like to save your work before
            leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
            onClick={onDiscard}
          >
            Discard
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-600 text-white hover:bg-green-500"
            onClick={onSave}
          >
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default NavigationConfirmation;
