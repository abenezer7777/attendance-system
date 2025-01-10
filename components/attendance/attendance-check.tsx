"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

export function AttendanceCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [hasActiveCheckIn, setHasActiveCheckIn] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [firstRecord, setFirstRecord] = useState("--:--");
  const [lastRecord, setLastRecord] = useState("--:--");
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  const { latitude, longitude, error: geoError } = useGeolocation();
  const { toast } = useToast();

  // Fetch initial status
  useEffect(() => {
    // Get nearest location first
    if (latitude && longitude) {
      getNearestLocation();
    }
  }, [latitude, longitude]);

  const getNearestLocation = async () => {
    try {
      const response = await fetch("/api/locations/nearest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });
      const { location } = await response.json();
      if (location) {
        setCurrentLocationId(location.id);
        await checkActiveStatus(location.id);
      }
    } catch (error) {
      console.error("Failed to get nearest location:", error);
    }
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const checkActiveStatus = async (locationId: string) => {
    try {
      const response = await fetch(
        `/api/attendance/status?locationId=${locationId}`
      );
      const data = await response.json();
      setHasActiveCheckIn(data.hasActiveCheckIn);
      setLocationName(data.activeLocation?.name || "");
      setFirstRecord(formatTime(data.firstRecord));
      setLastRecord(formatTime(data.lastRecord));
    } catch (error) {
      console.error("Failed to check status:", error);
    }
  };

  const handleAttendance = async () => {
    if (!latitude || !longitude) {
      toast({
        title: "Error",
        description: "Unable to get your location",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      // Find the nearest valid location
      const locationsResponse = await fetch("/api/locations/nearest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });

      const { location } = await locationsResponse.json();

      if (!location) {
        throw new Error("No valid location found nearby");
      }

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: location.id,
          latitude,
          longitude,
          type: hasActiveCheckIn ? "check-out" : "check-in",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      // Get current time for last record
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      // Only update last record
      setLastRecord(currentTime);

      // Update status for this location
      await checkActiveStatus(location.id);
      await queryClient.invalidateQueries({ queryKey: ["attendance"] });

      toast({
        title: "Success",
        description: `${
          hasActiveCheckIn ? "Checked out" : "Checked in"
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
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="p-4 flex items-center justify-between">
        <Link href="/attendance" className="text-green-500">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-green-500">
          {hasActiveCheckIn ? "Time out" : "Time in"}
        </h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </header>

      <main className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="relative w-48 h-48 mb-12">
          <div
            className={`absolute inset-0 ${
              hasActiveCheckIn ? "bg-red-500" : "bg-green-500"
            } rounded-hexagon opacity-20 animate-ping`}
          />
          <button
            onClick={handleAttendance}
            disabled={isChecking}
            className={`relative w-full h-full ${
              hasActiveCheckIn ? "bg-red-500" : "bg-green-500"
            } rounded-hexagon flex flex-col items-center justify-center text-white transition-colors`}
          >
            <span className="text-2xl mb-2">Touch</span>
            {isChecking && <span className="text-sm">Processing...</span>}
          </button>
        </div>
        {locationName && (
          <p className="text-green-500 mb-4 text-center">{locationName}</p>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-green-900/20 backdrop-blur-sm p-4 rounded-t-3xl">
          <div className="flex justify-between items-center px-4">
            <div>
              <p className="text-sm text-green-500">First record</p>
              <p className="text-xl font-semibold text-white">{firstRecord}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-500">Last record</p>
              <p className="text-xl font-semibold text-white">{lastRecord}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
