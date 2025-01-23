"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Circle,
  CircleCheckBig,
  Clock,
  ClockArrowDown,
  ClockArrowUpIcon,
  LogOut,
  MoveUpRight,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import TapIconSvg from "../../public/finger_gesture_hand_tap_icon2.svg";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { MonthlyAttendance } from "./monthly-attendance";

export function AttendanceCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [hasActiveCheckIn, setHasActiveCheckIn] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [firstRecord, setFirstRecord] = useState("--:--");
  const [lastRecord, setLastRecord] = useState("--:--");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null
  );
  const [totalHours, setTotalHours] = useState("--:--");
  const queryClient = useQueryClient();

  const { latitude, longitude, error: geoError } = useGeolocation();
  const { toast } = useToast();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      // second: "2-digit",
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
      setTotalHours(data.totalHours || "--:--");
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
    <>
      <div className=" flex flex-col gap-3 ">
        <Card className="">
          {/* <h1 className="bg-lime-500 w-full rounded-t-sm text-white p-3 text-1xl font-bold">
          Mark Your Attendance!
        </h1> */}
          <CardHeader className="text-center space-y-1 md:space-y-2">
            <CardTitle className="text-2xl md:text-3xl">
              {format(currentTime, "hh:mm a")}
            </CardTitle>
            <CardDescription>
              {format(currentTime, "MMMM dd, yyyy - EEEE")}
            </CardDescription>
            <CardDescription>{locationName}</CardDescription>
            {/* <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold">
              {format(currentTime, "hh:mm a")}
            </h2>
            <p className="text-muted-foreground">
              {format(currentTime, "MMMM dd, yyyy - EEEE")}
            </p>
            {locationName && (
              <p className="text-muted-foreground font-medium">
                {locationName}
              </p>
            )}
          </div> */}
          </CardHeader>

          <CardContent className=" w-full flex-1 flex flex-col items-center justify-between">
            <div className="flex-1 flex items-center justify-center mb-2">
              <div className="relative w-36 h-36 md:w-48 md:h-48">
                <button
                  onClick={handleAttendance}
                  disabled={isChecking}
                  className={`w-full h-full rounded-full ${
                    hasActiveCheckIn
                      ? "bg-gradient-to-br from-red-500 to-pink-500"
                      : "bg-gradient-to-br from-lime-400 to-lime-600"
                  } flex flex-col items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-70`}
                >
                  <div className="flex flex-col items-center space-y-1 md:space-y-2 text-white ">
                    {/* <TouchAppOutlinedIcon
                    sx={{
                      fontSize: "4rem",
                      transform: "rotate(-20deg)",
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
                    }}
                  /> */}
                    <Image
                      src={TapIconSvg}
                      alt="Tap Icon"
                      width={70}
                      height={70}
                    />
                    <h1 className="text-lg md:text-xl font-semibold text-white">
                      {isChecking
                        ? "Processing..."
                        : hasActiveCheckIn
                        ? "Clock out"
                        : "Clock in"}
                    </h1>
                  </div>
                </button>
              </div>
            </div>

            <Separator />

            <Card className=" border-none w-4/5 shadow-none pt-0">
              {/* <Separator /> */}
              <CardContent className="pt-6 w-full">
                <div className="flex justify-between items-center">
                  {/* Clock In */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="relative">
                      <Clock size={24} className="text-muted-foreground" />
                      {/* Green Arrow Down */}
                      <ArrowDown
                        size={16}
                        strokeWidth={4}
                        // className="absolute -bottom-2 left-1/2 transform -translate-x-2/2 text-green-500"
                        className="absolute top-2/2 left-6 transform -translate-x-1/2 -translate-y-1/2 text-green-500"
                      />
                      {/* <ClockArrowDown /> */}
                    </div>
                    <p className="text-base md:text-lg font-bold pt-1">
                      {firstRecord}
                    </p>
                    <span className="text-sm font-semibold mt-1 text-muted-foreground">
                      Clock In
                    </span>
                  </div>

                  {/* Clock Out */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="relative">
                      <Clock size={24} className="text-muted-foreground" />
                      {/* Red Arrow Up-Right */}
                      <ArrowUpRight
                        size={16}
                        strokeWidth={4}
                        className="absolute -bottom-0 left-6 transform -translate-x-1/2 text-red-500"
                      />
                      {/* <ClockArrowUpIcon /> */}
                    </div>
                    <p className="text-base md:text-lg  font-bold  pt-1">
                      {lastRecord}
                    </p>
                    <span className="text-sm mt-1 font-semibold text-muted-foreground">
                      Clock Out
                    </span>
                  </div>

                  {/* Total Hours */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="relative">
                      <Circle size={24} className="text-muted-foreground" />
                      <Check
                        size={16}
                        strokeWidth={4}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500"
                      />
                    </div>
                    <p className="text-base md:text-lg  font-bold pt-1">
                      {totalHours}
                    </p>
                    <span className="text-sm mt-1 font-semibold text-muted-foreground">
                      Total Hrs
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <div className="">
          <MonthlyAttendance />
        </div>
      </div>
    </>
  );
}
