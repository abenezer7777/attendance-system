"use client";

import { useState } from 'react';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';

export function AttendanceCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const { latitude, longitude, error: geoError } = useGeolocation();
  const { toast } = useToast();

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
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude,
          longitude,
          type: 'check-in',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check in');
      }

      toast({
        title: "Success",
        description: "Attendance recorded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record attendance",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="p-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-green-500">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-green-500">Clock in</h1>
        <User className="w-6 h-6 text-green-500" />
      </header>

      <main className="flex flex-col items-center justify-center min-h-[80vh]">
        <div 
          className="relative w-48 h-48 mb-12"
          onClick={handleAttendance}
        >
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping" />
          <button
            className="relative w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-semibold hover:bg-green-600 transition-colors"
            disabled={isChecking}
          >
            Touch
          </button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-green-500 p-4 rounded-t-3xl">
          <div className="flex justify-between items-center px-4">
            <div>
              <p className="text-sm opacity-80">First record</p>
              <p className="text-xl font-semibold">08:51:39</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Last record</p>
              <p className="text-xl font-semibold">--:--</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}