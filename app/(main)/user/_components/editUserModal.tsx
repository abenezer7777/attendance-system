"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Spinner from "@/components/Spinner";
import { toast } from "@/hooks/use-toast";
import { editUserSchema } from "@/lib/schemas/validationSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useGetRoles, useGetSupervisors } from "./user.query";
// import { useGetAllOrganizationsForTable } from "@/app/(main)/organization/org.query";
import { useGetLocations } from "@/app/(main)/location/loc.query";
import { useGetUsers } from "./user.query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, UserRoundMinus } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a type for the update form without password
type UpdateUserFormData = z.infer<typeof editUserSchema>;

type EditUserModalProps = {
  userData: any;
  isOpen: boolean;
  onClose: () => void;
};

export const EditUserModal: React.FC<EditUserModalProps> = ({
  userData,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setSubmitting] = useState(false);
  const { data: roles } = useGetRoles();
  // const { data: organizations } = useGetAllOrganizationsForTable();
  const { data: locations } = useGetLocations();
  const { data: users } = useGetUsers();

  console.log("Initial userData:", userData);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName,
      roleName: userData.role?.name,
      division: userData.division,
      department: userData.department,
      section: userData.section,
      phone: userData.phone || "",
      jobTitle: userData.jobTitle,
      jobRole: userData.jobRole,
      immediateSupervisor: userData.immediateSupervisor,
      location: userData.location,
      locationCategory: userData.locationCategory,
      category: userData.category,
      // assignedLocationIds:
      //   userData.assignedLocations?.map((loc: any) => loc.id) || [],
    },
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: async (data: UpdateUserFormData) => {
      console.log("Sending update data:", data);
      const response = await axios.patch(`/api/user/${userData.id}`, data);
      console.log("Server response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Update successful:", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "User Updated Successfully" });
      setSubmitting(false);
      onClose();
    },
    onError: (error: any) => {
      console.error("Update error:", error.response?.data || error);
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to update user",
      });
    },
  });

  const onSubmit = async (formData: UpdateUserFormData) => {
    try {
      console.log("Form submitted with data:", formData);
      setSubmitting(true);
      await updateUser(formData);
    } catch (error: any) {
      console.error("Submit error:", error);
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update user. Please try again.",
      });
    }
  };

  // Log form state changes
  // useEffect(() => {
  //   const subscription = form.watch((value: UpdateUserFormData) => {
  //     console.log("Form values changed:", value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="bg-[#8cc640] text-white">
          <DrawerTitle>Edit User</DrawerTitle>
          <DrawerDescription className="text-white">
            Update user information below
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log("Form submit event triggered");
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4 p-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles?.map((role: any) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="assignedLocationIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Locations</FormLabel>
                    <div className="space-y-2 border p-2 rounded-md max-h-32 overflow-y-auto">
                      {locations?.map((location: any) => (
                        <label
                          key={location.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            value={location.id}
                            checked={field.value?.includes(location.id)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), location.id]
                                : (field.value || []).filter(
                                    (id) => id !== location.id
                                  );
                              field.onChange(newValue);
                            }}
                          />
                          <span>{location.name}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <DrawerClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
