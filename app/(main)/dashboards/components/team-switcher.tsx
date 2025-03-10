"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Building2, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  type: z.enum(["division", "department"], {
    required_error: "Please select a team type",
  }),
});

type CreateTeamForm = z.infer<typeof createTeamSchema>;

type Team = {
  label: string;
  value: string;
  type: "division" | "department";
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  className?: string;
}

// Memoized team item component to prevent unnecessary re-renders
const TeamItem = React.memo(
  ({
    team,
    isSelected,
    onSelect,
  }: {
    team: Team;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <CommandItem key={team.value} onSelect={onSelect} className="text-sm">
      <Avatar className="mr-2 h-5 w-5">
        <AvatarFallback>
          {team.label.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {team.label}
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
);

TeamItem.displayName = "TeamItem";

// Memoized form component
const CreateTeamForm = React.memo(
  ({
    onSubmit,
    onCancel,
    isSubmitting,
  }: {
    onSubmit: (data: CreateTeamForm) => void;
    onCancel: () => void;
    isSubmitting: boolean;
  }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<CreateTeamForm>({
      resolver: zodResolver(createTeamSchema),
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage employees and attendance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team name</Label>
            <Input
              id="name"
              placeholder="Finance Department"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Team type</Label>
            <Select
              onValueChange={(value: "division" | "department") => {
                register("type").onChange({ target: { value } });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="division">
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4" />
                    Division
                  </div>
                </SelectItem>
                <SelectItem value="department">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Department
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    );
  }
);

CreateTeamForm.displayName = "CreateTeamForm";

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const queryClient = useQueryClient();

  // Optimized query with proper caching and stale time
  const { data: teamsData, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }
      return response.json();
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 60000, // Keep data in cache for 1 minute
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: CreateTeamForm) => {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create team");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setShowNewTeamDialog(false);
      toast.success("Team created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create team: " + error.message);
    },
  });

  // Use callback to prevent recreation on each render
  const handleCreateTeam = React.useCallback(
    (data: CreateTeamForm) => {
      createTeamMutation.mutate(data);
    },
    [createTeamMutation]
  );

  const handleCloseDialog = React.useCallback(() => {
    setShowNewTeamDialog(false);
  }, []);

  // Set initial team only once when data is loaded
  React.useEffect(() => {
    if (teamsData?.groups?.[0]?.teams?.[0] && !selectedTeam) {
      setSelectedTeam(teamsData.groups[0].teams[0]);
    }
  }, [teamsData, selectedTeam]);

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className={cn("w-[200px] justify-between", className)}
      >
        Loading...
      </Button>
    );
  }

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
            {selectedTeam ? (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarFallback>
                    {selectedTeam.label.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedTeam.label}
              </>
            ) : (
              "Select team"
            )}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {teamsData?.groups.map((group: any) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team: Team) => (
                    <TeamItem
                      key={team.value}
                      team={team}
                      isSelected={selectedTeam?.value === team.value}
                      onSelect={() => {
                        setSelectedTeam(team);
                        setOpen(false);
                      }}
                    />
                  ))}
                </CommandGroup>
              ))}
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
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <CreateTeamForm
          onSubmit={handleCreateTeam}
          onCancel={handleCloseDialog}
          isSubmitting={createTeamMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
