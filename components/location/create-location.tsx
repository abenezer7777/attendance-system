// "use client";

// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "@/hooks/use-toast";
// import Spinner from "@/components/Spinner";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

// const locationSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   latitude: z
//     .string()
//     .refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
//   longitude: z
//     .string()
//     .refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
//   radius: z
//     .string()
//     .refine((val) => !isNaN(parseInt(val)), "Must be a valid number"),
// });

// type LocationFormValues = z.infer<typeof locationSchema>;

// export function CreateLocation() {
//   const [open, setOpen] = useState(false);
//   const queryClient = useQueryClient();

//   const form = useForm<LocationFormValues>({
//     resolver: zodResolver(locationSchema),
//     defaultValues: {
//       name: "",
//       latitude: "",
//       longitude: "",
//       radius: "",
//     },
//   });

//   const { mutate: createLocation, isLoading } = useMutation({
//     mutationFn: async (data: LocationFormValues) => {
//       const response = await fetch("/api/locations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...data,
//           latitude: parseFloat(data.latitude),
//           longitude: parseFloat(data.longitude),
//           radius: parseInt(data.radius),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create location");
//       }

//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["locations"] });
//       toast({ title: "Location created successfully" });
//       setOpen(false);
//       form.reset();
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   function onSubmit(data: LocationFormValues) {
//     createLocation(data);
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <Button>Create Location</Button>
//       </DrawerTrigger>
//       <DrawerContent className="p-6">
//         <DrawerHeader className="bg-[#8cc640] text-white">
//           <DrawerTitle>Create New Location</DrawerTitle>
//         </DrawerHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Location Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter location name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="latitude"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Latitude</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter latitude" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="longitude"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Longitude</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter longitude" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="radius"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Radius (in meters)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter radius" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? <Spinner /> : "Create Location"}
//             </Button>
//           </form>
//         </Form>
//       </DrawerContent>
//     </Drawer>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import { useGeolocation } from "@/lib/hooks/use-geolocation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "@/hooks/use-toast";
// import Spinner from "@/components/Spinner";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

// // Dynamically import the map so it doesn't run on the server.
// const MapComponent = dynamic(
//   () => import("@/components/location/MapComponent"),
//   { ssr: false }
// );

// const locationSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   latitude: z
//     .string()
//     .refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
//   longitude: z
//     .string()
//     .refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
//   radius: z
//     .string()
//     .refine((val) => !isNaN(parseInt(val)), "Must be a valid number"),
// });

// type LocationFormValues = z.infer<typeof locationSchema>;

// export function CreateLocation() {
//   const [open, setOpen] = useState(false);
//   const queryClient = useQueryClient();
//   const { latitude, longitude, loading: geoLoading } = useGeolocation();

//   const form = useForm<LocationFormValues>({
//     resolver: zodResolver(locationSchema),
//     defaultValues: {
//       name: "",
//       latitude: "",
//       longitude: "",
//       radius: "300", // Default radius in meters
//     },
//   });

//   // When geolocation is available, update form values.
//   useEffect(() => {
//     if (latitude && longitude) {
//       form.setValue("latitude", latitude.toString());
//       form.setValue("longitude", longitude.toString());
//     }
//   }, [latitude, longitude, form]);

//   // Function to auto-detect location.
//   const handleAutoLocate = () => {
//     if (latitude && longitude) {
//       form.setValue("latitude", latitude.toString());
//       form.setValue("longitude", longitude.toString());
//       toast({
//         title: "Location Updated",
//         description: "Current location coordinates set successfully",
//       });
//     }
//   };

//   const { mutate: createLocation, status } = useMutation({
//     mutationFn: async (data: LocationFormValues) => {
//       const response = await fetch("/api/locations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...data,
//           latitude: parseFloat(data.latitude),
//           longitude: parseFloat(data.longitude),
//           radius: parseInt(data.radius),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create location");
//       }

//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["locations"] });
//       toast({ title: "Location created successfully" });
//       setOpen(false);
//       form.reset();
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   function onSubmit(data: LocationFormValues) {
//     createLocation(data);
//   }

//   const isLoading = status === "pending";

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <div className="flex justify-end">
//         <DrawerTrigger asChild>
//           <Button>Create Location</Button>
//         </DrawerTrigger>
//       </div>
//       <DrawerContent>
//         <DrawerHeader className="bg-[#8cc640] text-white">
//           <DrawerTitle className="text-sm text-white">
//             Create New Location
//           </DrawerTitle>
//           <DrawerDescription className="text-sm text-white">
//             Complete the form below to add a new Location.
//           </DrawerDescription>
//         </DrawerHeader>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="flex flex-col justify-between h-full"
//           >
//             <div className="grid sm:grid-cols-2 gap-6 py-4 px-6">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Location Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter location name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="latitude"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Latitude</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter latitude" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="longitude"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Longitude</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter longitude" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="radius"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Radius (meters)</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter radius" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             {/* Display Map and Radius Slider if Latitude and Longitude exist */}
//             {form.getValues("latitude") && form.getValues("longitude") && (
//               <div className="px-6 pb-4">
//                 <div className="mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Adjust Radius (meters)
//                   </label>
//                   <input
//                     type="range"
//                     min="100"
//                     max="1000"
//                     step="50"
//                     value={parseInt(form.getValues("radius") || "300")}
//                     onChange={(e) => form.setValue("radius", e.target.value)}
//                     className="mt-2 w-full"
//                   />
//                   <div className="text-sm text-gray-500">
//                     {form.getValues("radius")} meters
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <MapComponent
//                     latitude={form.getValues("latitude")}
//                     longitude={form.getValues("longitude")}
//                     radius={parseInt(form.getValues("radius") || "300")}
//                   />
//                 </div>
//               </div>
//             )}
//             <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleAutoLocate}
//                 disabled={geoLoading}
//               >
//                 {geoLoading ? <Spinner /> : "Auto-detect Location"}
//               </Button>
//               <DrawerClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DrawerClose>
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? <Spinner /> : "Create Location"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DrawerContent>
//     </Drawer>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/Spinner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";
import { locationSchema, LocationCategory } from "@/lib/schemas/validationSchema";
import { z } from "zod";

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

// Component to update map view and handle zoom events
function MapController({
  lat,
  lng,
  setRadius,
}: {
  lat: number;
  lng: number;
  setRadius: (radius: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng]);

    const handleZoomChange = () => {
      const zoom = map.getZoom();
      const newRadius = Math.max(100, 5000 / Math.pow(2, zoom - 10));
      setRadius(Math.round(newRadius).toString());
    };

    map.on("zoomend", handleZoomChange);
    return () => {
      map.off("zoomend", handleZoomChange);
    };
  }, [lat, lng, map, setRadius]);

  return null;
}

type LocationFormValues = z.infer<typeof locationSchema>;

export function CreateLocation() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { latitude, longitude, loading: geoLoading } = useGeolocation();

  // Set default values including a default category value.
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      category: "HEAD_QUARTER",
      latitude: 0,
      longitude: 0,
      radius: 200, // Default radius in meters
    },
  });

  useEffect(() => {
    if (latitude && longitude) {
      form.setValue("latitude", parseFloat(latitude.toString()));
      form.setValue("longitude", parseFloat(longitude.toString()));
    }
  }, [latitude, longitude, form]);

  const handleAutoLocate = () => {
    if (latitude && longitude) {
      form.setValue("latitude", parseFloat(latitude.toString()));
      form.setValue("longitude", parseFloat(longitude.toString()));
      toast({
        title: "Location Updated",
        description: "Current location coordinates set successfully",
      });
    }
  };

  const { mutate: createLocation, status } = useMutation({
    mutationFn: async (data: LocationFormValues) => {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // Convert string values to numbers for the API
          latitude: parseFloat(data.latitude as unknown as string),
          longitude: parseFloat(data.longitude as unknown as string),
          radius: parseInt(data.radius as unknown as string),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create location");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast({ title: "Location created successfully" });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: LocationFormValues) {
    createLocation(data);
  }

  const isLoading = status === "pending";
  const lat = form.watch("latitude") || 0;
  const lng = form.watch("longitude") || 0;
  const radius = parseInt(form.watch("radius") as unknown as string) || 200;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="flex justify-end">
        <DrawerTrigger asChild>
          <Button>Create Location</Button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <DrawerHeader className="bg-[#8cc640] text-white">
          <DrawerTitle className="text-sm text-white">
            Create New Location
          </DrawerTitle>
          <DrawerDescription className="text-sm text-white">
            Complete the form below to add a new Location.
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category Selection */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Category</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="border rounded p-2"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {/* Map over the options array */}
                        {z.enum(LocationCategory.options).options.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter latitude"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter longitude"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Radius (in meters)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter radius"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Map Display */}
            {lat !== 0 && lng !== 0 && (
              <div className="px-6 py-4">
                <div className="h-64 w-full">
                  <MapContainer
                    center={[lat, lng]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Circle center={[lat, lng]} radius={radius} />
                    <MapController
                      lat={lat}
                      lng={lng}
                      setRadius={(value) =>
                        form.setValue("radius", Number(value))
                      }
                    />
                  </MapContainer>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAutoLocate}
                disabled={geoLoading}
              >
                {geoLoading ? <Spinner /> : "Auto-detect Location"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner /> : "Create Location"}
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
