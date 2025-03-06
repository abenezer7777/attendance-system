"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import {
  createOrganizationSchema,
  orgLevel,
} from "@/lib/schemas/validationSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  useCreateOrganizationMutation,
  useGetAllOrganizations,
} from "./org.query";
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
import Spinner from "@/components/Spinner";
import { useTheme } from "next-themes";
import { Can } from "@/components/casl/Can";
import { useQueryClient } from "@tanstack/react-query";

export type Organ = z.infer<typeof createOrganizationSchema>;

type OrganizationOption = {
  label: string;
  value: string;
  id: string;
};

export function OrgForm() {
  const queryClient = useQueryClient();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isOrgOpen, setIsOrgOpen] = useState(false);
  const [organizationOptions, setOrganizationOptions] = useState<
    OrganizationOption[]
  >([]);

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    defaultValues: { parentId: undefined, level: "DIVISION", name: "" },
    resolver: zodResolver(createOrganizationSchema),
  });

  const { watch } = form;
  const watchLevel = watch("level") ?? "DIVISION";

  const { data: organizations } = useGetAllOrganizations({
    level: watchLevel,
  });

  const { mutateAsync: createOrganization } = useCreateOrganizationMutation();

  useEffect(() => {
    if (organizations) {
      const options = organizations.map((org: any) => ({
        label: org.name,
        value: org.name, // Use name for filtering in CommandInput
        id: org.id,
      }));
      console.log("organizationOptions:", options);
      setOrganizationOptions(options);

      // Reset parentId when level or organizations change
      form.setValue("parentId", undefined, {
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [organizations, form]);

  async function onSubmit(data: z.infer<typeof createOrganizationSchema>) {
    try {
      setSubmitting(true);
      await createOrganization(data);
      toast({ title: "Organization Created Successfully" });
      form.reset({
        level: "DIVISION",
        name: "",
        parentId: undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["organiations"] });
    } catch (error: any) {
      setSubmitting(false);
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Drawer>
      <div className="flex justify-end">
        <Can I={"create"} a={"Organization"}>
          <DrawerTrigger asChild>
            <Button size={"sm"}>
              Organization <Plus className="w-4 mx-1" />
            </Button>
          </DrawerTrigger>
        </Can>
      </div>

      <DrawerContent>
        <DrawerHeader className="bg-[#8cc640] text-white">
          <DrawerTitle className="text-xl font-semibold">
            Create New Organization
          </DrawerTitle>
          <DrawerDescription className="text-sm text-white">
            Complete the form below to add a new organization.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-between h-full"
          >
            <div className="grid sm:grid-cols-2 gap-6 py-4 px-6">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Organization Level <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("parentId", undefined, {
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-none">
                          <SelectValue placeholder="Select Organization Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DIVISION">Division</SelectItem>
                        <SelectItem value="DEPARTMENT">Department</SelectItem>
                        <SelectItem value="SECTION">Section</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Organization Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-none"
                        placeholder="Enter Organization Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchLevel !== "DIVISION" && (
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Parent Organization{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover open={isOrgOpen} onOpenChange={setIsOrgOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isOrgOpen}
                              className={cn(
                                "w-full justify-between rounded-none",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? organizationOptions.find(
                                    (organization) =>
                                      organization.id === field.value
                                  )?.label ?? "Select a parent organization"
                                : "Select a parent organization"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search organization..."
                              className="h-9 pointer-events-auto input"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No organization found.
                              </CommandEmpty>
                              <CommandGroup className="pointer-events-auto ">
                                {organizationOptions.map((organization) => (
                                  <CommandItem
                                    key={organization.id}
                                    value={organization.label} // Use label for filtering
                                    onSelect={(currentValue) => {
                                      const selectedOrg =
                                        organizationOptions.find(
                                          (org) => org.label === currentValue
                                        );
                                      const newValue =
                                        selectedOrg?.id === field.value
                                          ? undefined
                                          : selectedOrg?.id;
                                      field.onChange(newValue);
                                      setIsOrgOpen(false);
                                    }}
                                  >
                                    {organization.label}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        organization.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
      </DrawerContent>
    </Drawer>
  );
}
