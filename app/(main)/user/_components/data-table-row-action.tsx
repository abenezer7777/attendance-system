// "use client";

// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
// import { Row } from "@tanstack/react-table";
// import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import TanStack Query
// import axios from "axios"; // Import axios for making requests

// import { Button } from "../../../../components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "../../../../components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { useState } from "react";

// import { editUserSchema } from "@/schemas/validationSchema";
// import { z } from "zod";
// import { toast } from "@/hooks/use-toast";

// import { Can } from "@/components/casl/Can";
// import Link from "next/link";
// import { EditUserModal } from "./editUserModal";

// type UserData = z.infer<typeof editUserSchema>;
// interface DataTableRowActionsProps<TData extends UserData> {
//   row: Row<TData>;
// }
// export function DataTableRowActions<TData>({
//   row,
// }: DataTableRowActionsProps<UserData>) {
//   const [isEditModalOpen, setEditModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   const queryClient = useQueryClient();

//   //   // Mutation to handle the delete request
//   const deleteMutation = useMutation({
//     mutationFn: async () => {
//       const { id } = row.original; // Assuming each row has a unique ID
//       await axios.delete(`/api/user/${id}`); // Make API request to delete item
//     },
//     onSuccess: () => {
//       // Invalidate or refetch the letters data to update the table
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//       toast({
//         // variant: "success",
//         title: "User Deleted Successfully",
//       });
//     },
//     // onSettled: () => {
//     //   setDeleteDialogOpen(false); // Ensure dialog closes even if there's an error
//     // },
//     onError: (error: any) => {
//       console.error("Failed to delete User:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error?.response?.data?.message || "Failed to delete user",
//       });
//     },
//   });

//   const handleDelete = () => {
//     deleteMutation.mutate();
//     setDeleteDialogOpen(false); // Close the dialog after deletion
//   };
//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
//           >
//             <DotsHorizontalIcon className="h-4 w-4" />
//             <span className="sr-only">Open menu</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-[160px]">
//           <DropdownMenuItem
//             onClick={() => {
//               setEditModalOpen(true);
//             }}
//           >
//             Edit
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => {
//               setDeleteDialogOpen(true);
//             }}
//             className="text-red-500"
//           >
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <EditUserModal
//         userData={row.original}
//         isOpen={isEditModalOpen}
//         onClose={() => setEditModalOpen(false)}
//       />
//       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete User</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this user? This action cannot be
//               undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-destructive"
//               onClick={handleDelete}
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
"use client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditUserModal } from "./editUserModal";
import { toast } from "@/hooks/use-toast";
import { createUserSchema} from "@/lib/schemas/validationSchema";
import { z } from "zod";

type UserData = z.infer<typeof createUserSchema>;
interface DataTableRowActionsProps<TData extends UserData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<UserData>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { id } = row.original;

      // Delete related attendance records first
      await axios.delete(`/api/attendance?userId=${id}`);

      // Then delete the user
      await axios.delete(`/api/user/${id}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteOpen(false);
    },
    onSuccess: () => toast({ title: "User Deleted Successfully" }),
    onError: (error: any) =>
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete user",
      }),
  });

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setIsEditOpen(true);
              setIsMenuOpen(false);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              setIsDeleteOpen(true);
              setIsMenuOpen(false);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserModal
        userData={row.original}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={() => deleteMutation.mutate()}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
