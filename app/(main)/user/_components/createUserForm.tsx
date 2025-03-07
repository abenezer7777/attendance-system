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
import { createUserSchema } from "@/lib/schemas/validationSchema";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Can } from "@/components/casl/Can";
import { Plus } from "lucide-react";
import {
  useCreateUserMutation,
  useGetRoles,
  useGetUsers,
  useGetSupervisors,
} from "./user.query";
import {
  useGetLocations,
  useGetLocationsOnOrgnization,
} from "@/app/(main)/location/loc.query";
// import { useGetAllOrganizationsForTable } from "@/app/(main)/organization/org.query";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export function CreateUserForm() {
  const [isSubmitting, setSubmitting] = useState(false);
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      id: "",
      email: "",
      fullName: "",
      password: "",
      roleName: "",
      organizationId: "",
      assignedLocationIds: [],
      jobTitle: "",
      jobRole: "",
      mobile: "",
      supervisorId: "",
    },
  });

  const { data: roles } = useGetRoles();
  // const { data: organizations } = useGetAllOrganizationsForTable();
  // const { data: locations } = useGetLocationsOnOrgnization(
  //   form.watch("organizationId")
  // );
  const { data: locations } = useGetLocations();
  const { data: users } = useGetUsers();
  const { mutateAsync: createUser } = useCreateUserMutation();
  console.log("locations fron user create", locations);

  async function onSubmit(data: CreateUserFormValues) {
    try {
      setSubmitting(true);
      await createUser(data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "User Created Successfully" });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create User
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="bg-[#8cc640] text-white">
          <DrawerTitle>Create New User</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-4"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Employee ID */}
              <FormField
                name="id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Employee ID<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter employee ID" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="Enter email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Full Name */}
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
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

              {/* Role */}
              <FormField
                name="roleName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.map((role: any) => (
                            <SelectItem key={role.id} value={role.name}>
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

              {/* Organization */}
              {/* <FormField
                name="organizationId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations?.map((org: any) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Supervisor */}
              <FormField
                control={form.control}
                name="supervisorId"
                render={({ field }) => {
                  const [open, setOpen] = useState(false);
                  const [search, setSearch] = useState("");
                  const [page, setPage] = useState(1);
                  const { data, isFetching } = useGetSupervisors(search, page);

                  // Ensure data.users exists and is an array
                  const users = data?.users || [];
                  const hasMore = data?.hasMore || false;

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
                              {users.find(
                                (user: any) => user.id === field.value
                              )?.fullName || "Select supervisor..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Search supervisors..."
                              value={search}
                              onValueChange={setSearch}
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

              {/* Job Title */}
              <FormField
                name="jobTitle"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Job Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Role */}
              <FormField
                name="jobRole"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Job Role" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile */}
              <FormField
                name="mobile"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Mobile Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigned Locations (Multi-select via checkboxes) */}
              <FormField
                control={form.control}
                name="assignedLocationIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Locations</FormLabel>
                    <div className="space-y-2 border p-2 rounded-md max-h-32 overflow-y-auto">
                      {locations?.map((loc: any) => (
                        <label
                          key={loc.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            value={loc.id}
                            checked={field.value?.includes(loc.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, loc.id]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (id: string) => id !== loc.id
                                  )
                                );
                              }
                            }}
                          />
                          <span>{loc.name}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DrawerFooter className="flex justify-end gap-4">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Create"}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
