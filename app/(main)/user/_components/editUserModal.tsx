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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a type for the update form without password
type UpdateUserFormData = Omit<z.infer<typeof editUserSchema>, "password">;

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
    resolver: zodResolver(editUserSchema.omit({ password: true })),
    defaultValues: {
      employeeId: userData.employeeId,
      email: userData.email,
      fullName: userData.fullName,
      roleName: userData.role?.name,
      organizationId: userData.organizationId,
      jobTitle: userData.jobTitle,
      jobRole: userData.jobRole,
      mobile: userData.mobile || "",
      supervisorId: userData.supervisorId || "",
      assignedLocationIds:
        userData.assignedLocations?.map((loc: any) => loc.id) || [],
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
                name="employeeId"
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

              {/* <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations?.map((org: any) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="supervisorId"
                render={({ field }) => {
                  const [open, setOpen] = useState(false);
                  const [search, setSearch] = useState("");
                  const [page, setPage] = useState(1);
                  const { data: supervisorsData, isFetching } =
                    useGetSupervisors(search, page);

                  // Ensure users array exists with fallback
                  const users = supervisorsData?.users || [];
                  const hasMore = supervisorsData?.hasMore || false;

                  return (
                    <FormItem>
                      <FormLabel>Supervisor</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between"
                            >
                              {field.value
                                ? users.find(
                                    (user: any) => user.id === field.value
                                  )?.fullName
                                : "Select supervisor..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Search supervisors..."
                              value={search}
                              onValueChange={(value) => {
                                setSearch(value);
                                setPage(1);
                              }}
                              className="pointer-events-auto"
                            />
                            <CommandList>
                              <CommandEmpty>No supervisor found.</CommandEmpty>
                              <CommandGroup className="pointer-events-auto">
                                <div className="max-h-[200px] overflow-y-auto">
                                  {users.map((user: any) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.id}
                                      onSelect={() => {
                                        field.onChange(
                                          user.id === field.value ? "" : user.id
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === user.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {user.fullName}
                                    </CommandItem>
                                  ))}
                                  {hasMore && (
                                    <div className="py-2 px-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => setPage(page + 1)}
                                        disabled={isFetching}
                                      >
                                        {isFetching ? <Spinner /> : "Load more"}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
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
              />
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
