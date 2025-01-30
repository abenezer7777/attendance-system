"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/Spinner";
import { createUserSchema } from "@/schemas/validationSchema";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Can } from "@/components/casl/Can";
import { Plus } from "lucide-react";
import { useCreateUserMutation, useGetRoles } from "./user.query";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export function CreateUserForm() {
  const [isSubmitting, setSubmitting] = useState(false);
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      employeeId: "",
      email: "",
      fullName: "",
      // username: "",
      password: "",
      roleName: "",
      location: "",
      locationCategory: "",
      jobTitle: "",
      jobRole: "",
    },
  });
  const { data: roles } = useGetRoles();
  const { mutateAsync: createUser } = useCreateUserMutation();

  async function onSubmit(data: z.infer<typeof createUserSchema>) {
    try {
      setSubmitting(true);
      await createUser(data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        // variant: "success",
        title: "User Created Succesfully",
      });
      form.reset({
        email: "",
        fullName: "",
        employeeId: "",
        password: "",
        roleName: "",
        location: "",
        locationCategory: "",
        jobTitle: "",
        jobRole: "",

        // username: "",
      }); // Reset to default values
    } catch (error: any) {
      setSubmitting(false);
      // console.log("🚀 ~ onSubmit ~ error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "An unexpected error occurred. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setSubmitting(false); // Stop spinner after submission attempt
    }
  }

  return (
    <Drawer>
      {/* <div className="max-w-lg mx-auto p-6"> */}
      <div className="flex justify-end ">
        {/* <Can I={"create"} a={"User"}> */}
        <DrawerTrigger asChild>
          <Button size={"sm"}>
            User <Plus className="w-4 mx-1" />
          </Button>
        </DrawerTrigger>
        {/* </Can> */}
      </div>
      <DrawerContent>
        <DrawerHeader className="bg-[#8cc640] text-white">
          <DrawerTitle className="text-xl font-semibold">
            Create New User
          </DrawerTitle>
          <DrawerDescription className="text-sm text-white">
            Complete the form below to add a new User.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={` flex flex-col justify-between h-full`}
          >
            <div className="grid sm:grid-cols-2 gap-6 py-4 px-6 ">
              {/* Employee Number */}
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Employee Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter employee number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Enter password"
                      />
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
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)} // Update form field value
                        defaultValue={field.value} // Set default value to current field value
                      >
                        <SelectTrigger className="w-full rounded-none border border-gray-300">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Input {...field} placeholder="Enter location Category" />
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Create"}
              </Button>
            </div>
          </form>
        </Form>
        {/* </div> */}
      </DrawerContent>
    </Drawer>
  );
}
