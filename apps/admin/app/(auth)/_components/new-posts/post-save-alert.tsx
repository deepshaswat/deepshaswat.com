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

const NavigationConfirmation = ({
  isOpen,
  onClose,
  onSave,
  onDiscard,
}: NavigationConfirmationProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='bg-neutral-800 text-neutral-200'>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription className='text-neutral-400'>
            You have unsaved changes. Would you like to save your work before
            leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onDiscard}
            className='bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
          >
            Discard
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onSave}
            className='bg-green-600 text-white hover:bg-green-500'
          >
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NavigationConfirmation;
