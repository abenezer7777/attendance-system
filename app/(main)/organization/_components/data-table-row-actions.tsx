"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import TanStack Query
import axios from "axios"; // Import axios for making requests

import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
// import EditLetterModal from "./EditLetterModal";
// import { createLetterSchema } from "../../../../../schemas/validationSchema";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { organizationSchema } from "@/schemas/validationSchemaaa";
// import LetterTemplateModal from "./LetterTemplateModal";

type Organization = z.infer<typeof organizationSchema>;
interface DataTableRowActionsProps<TData extends Organization> {
  row: Row<TData>;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<Organization>) {
  // const [isEditModalOpen, setEditModalOpen] = useState(false);
  // const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  // const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // const handleTemplateOpen = () => {
  //   setTemplateModalOpen(true);
  // };

  // const queryClient = useQueryClient();

  // // Mutation to handle the delete request
  // const deleteMutation = useMutation({
  //   mutationFn: async () => {
  //     const { id } = row.original; // Assuming each row has a unique ID
  //     await axios.delete(`/api/letters/${id}`); // Make API request to delete item
  //   },
  //   onSuccess: () => {
  //     // Invalidate or refetch the letters data to update the table
  //     queryClient.invalidateQueries({ queryKey: ["letters"] });
  //   },
  //   onError: (error) => {
  //     console.error("Failed to delete letter:", error);
  //   },
  // });

  // const handleDelete = () => {
  //   deleteMutation.mutate();
  //   setDeleteDialogOpen(false); // Close the dialog after deletion
  // };

  // // Open the edit modal
  // const handleEdit = () => {
  //   setEditModalOpen(true);
  // };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          {/* <DropdownMenuItem>Make a copy</DropdownMenuItem> */}
          <DropdownMenuItem>Templete</DropdownMenuItem>
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Letter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this letter? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isEditModalOpen && (
        <EditLetterModal
          letterData={row.original}
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {isTemplateModalOpen && (
        <LetterTemplateModal
          letterData={{
            reference: (row.original as LetterWithReference).reference,
            subject: row.original.subject,
            letterDate: row.original.letterDate,
            recipient: row.original.recipient,
          }}
          isOpen={isTemplateModalOpen}
          onClose={() => setTemplateModalOpen(false)}
        />
      )} */}
    </>
  );
}
