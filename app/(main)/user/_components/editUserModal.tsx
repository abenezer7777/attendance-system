"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Spinner from "@/components/Spinner";
import { toast } from "@/hooks/use-toast";
import { createUserSchema, editUserSchema } from "@/schemas/validationSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useGetRoles } from "./user.query";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type userData = z.infer<typeof editUserSchema>;

type EditUserModalProps = {
  userData: userData;
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
  const { theme } = useTheme();
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { ...userData },
  });
  //   useEffect(() => {
  //     form.reset({ ...userData });
  //   }, [userData, form]);
  const { data: roles } = useGetRoles();

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: async (data: any) => {
      await axios.patch(`/api/user/${userData.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        // variant: "success",
        title: "User Updated Successfully",
      });
      setSubmitting(false);
      onClose();
    },
    onError: (error: any) => {
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Failed to update user",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof createUserSchema>) => {
    setSubmitting(true);
    await updateUser(data);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <div className="flex justify-end ">
        <DrawerContent>
          <DrawerHeader className="bg-[#8cc640] text-white">
            <DrawerTitle className="text-xl font-semibold">
              Edit User
            </DrawerTitle>
            <DrawerDescription className="text-sm text-white ">
              Complete the form below to Edit a User.
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={` flex flex-col justify-between h-full`}
            >
              <div className="grid sm:grid-cols-2 gap-6 py-4 px-6 ">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password */}
                {/* <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      //   {...field}
                      placeholder="Enter password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
                {/* Employee Number */}
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter employee number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Role */}
                <FormField
                  control={form.control}
                  name="roleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)} // Update the field value
                          defaultValue={field.value} // Ensure current role is pre-selected
                        >
                          <SelectTrigger className="w-full rounded-none border border-gray-300">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Placeholder option */}
                            {roles?.map((role: any) => (
                              <SelectItem key={role.name} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* locationCategory */}
                <FormField
                  control={form.control}
                  name="locationCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>location Category</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter location Category"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* jobTitle */}
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter jobTitle" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* jobRole */}
                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Role</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter jobRole" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isDirty}
                >
                  {isSubmitting ? <Spinner /> : "Edit"}
                </Button>
              </div>
            </form>
          </Form>
        </DrawerContent>
      </div>
    </Drawer>
  );
};
