"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for division and department
type Division = {
  label: string;
  value: string;
};

type Department = {
  label: string;
  value: string;
};

// Define a type for the team (either Division or Department)
type Team = Division | Department;

// Fetch divisions and departments
async function fetchDivisionsAndDepartments() {
  const res = await fetch("/api/org/divisions-departments");
  if (!res.ok) {
    throw new Error("Failed to fetch divisions and departments");
  }
  return res.json();
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  onTeamChange: (team: Team) => void;
}

export default function TeamSwitcher({
  className,
  onTeamChange,
}: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>({
    label: "All",
    value: "all",
  });

  // Fetch divisions and departments using react-query
  const { data, isLoading, error } = useQuery({
    queryKey: ["divisionsAndDepartments"],
    queryFn: fetchDivisionsAndDepartments,
  });

  React.useEffect(() => {
    onTeamChange(selectedTeam);
  }, [selectedTeam, onTeamChange]);

  const divisions = data?.divisions || [];
  const departments = data?.departments || [];

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedTeam.label}
            <ChevronsUpDown className="ml-auto opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search team..." />
            <CommandList>
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Divisions">
                <CommandItem
                  key="all"
                  onSelect={() => {
                    setSelectedTeam({ label: "All", value: "all" });
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  All Divisions
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedTeam.value === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
                {divisions.map((division: Division) => (
                  <CommandItem
                    key={division.value}
                    onSelect={() => {
                      setSelectedTeam(division);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    {division.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedTeam.value === division.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Departments">
                {departments.map((department: Department) => (
                  <CommandItem
                    key={department.value}
                    onSelect={() => {
                      setSelectedTeam(department);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    {department.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedTeam.value === department.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircle className="h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
