"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Papa from "papaparse";
import Spinner from "@/components/Spinner";

export function CSVUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          try {
            // Trim keys and values in each row.
            const trimmedData = results.data.map((row: any) => {
              const newRow: Record<string, any> = {};
              Object.keys(row).forEach((key) => {
                const trimmedKey = key.trim();
                newRow[trimmedKey] =
                  typeof row[key] === "string" ? row[key].trim() : row[key];
              });
              return newRow;
            });

            console.log("Trimmed CSV Data:", trimmedData);

            // Filter out rows that are completely empty or missing required fields.
            const cleanedData = trimmedData.filter((row: any) => {
              // Check if the row has any non-empty values.
              const hasAnyData = Object.values(row).some(
                (val) => val !== "" && val != null
              );
              // Require certain fields (adjust these as necessary)
              return (
                hasAnyData &&
                row.email &&
                row.employeeId &&
                row.fullName &&
                row.password !== ""
              );
            });

            console.log("Cleaned CSV Data:", cleanedData);

            if (cleanedData.length === 0) {
              toast({
                title: "No Valid Data",
                description:
                  "No rows with complete required fields were found.",
                variant: "destructive",
              });
              return;
            }

            const response = await fetch("/api/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ users: cleanedData }),
            });

            if (!response.ok) {
              throw new Error("Upload failed");
            }

            toast({
              title: "Success",
              description: "Users imported successfully",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to import users",
              variant: "destructive",
            });
          }
        },
        error: (error: any) => {
          toast({
            title: "Error",
            description: "Failed to parse CSV file",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => document.getElementById("csvInput")?.click()}
        disabled={isUploading}
      >
        {isUploading ? <Spinner /> : "Import Users (CSV)"}
      </Button>
      <input
        id="csvInput"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
