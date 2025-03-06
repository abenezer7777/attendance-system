"use client";

import { useState } from "react";

import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

interface CheckInOutProps {
  building: Building[];
}

export function CheckInOut({ building }: CheckInOutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const {
    latitude,
    longitude,
    error: geoError,
    loading: geoLoading,
  } = useGeolocation();
  const { toast } = useToast();

  const handleAttendance = async (
    type: "check-in" | "check-out",
    locationId: string
  ) => {
    if (!latitude || !longitude) {
      toast({
        title: "Error",
        description: "Unable to get your location",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          latitude,
          longitude,
          type,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      await queryClient.invalidateQueries({ queryKey: ["attendance"] });

      toast({
        title: "Success",
        description: `${
          type === "check-in" ? "Checked in" : "Checked out"
        } successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to record attendance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (geoLoading) {
    return <div>Loading location...</div>;
  }

  // if (geoError) {
  //   return <div>Error: {geoError}</div>;
  // }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {building.map((build) => (
        <Card key={build.id}>
          <CardHeader>
            <CardTitle>{build.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              onClick={() => handleAttendance("check-in", build.id)}
              disabled={isLoading}
            >
              Check In
            </Button>
            <Button
              onClick={() => handleAttendance("check-out", build.id)}
              disabled={isLoading}
              variant="outline"
            >
              Check Out
            </Button>
          </CardContent>
        </Card>
      ))}
      <div></div>
    </div>
  );
}
