import { CreateLocation } from "@/components/location/create-location";
import React from "react";

function LocationPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <CreateLocation />
    </div>
  );
}

export default LocationPage;
