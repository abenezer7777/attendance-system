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
"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const locationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  latitude: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
  longitude: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
  radius: z
    .string()
    .refine((val) => !isNaN(parseInt(val)), "Must be a valid number"),
});

type LocationFormValues = z.infer<typeof locationSchema>;

export function CreateLocation() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { latitude, longitude, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude) {
      form.setValue("latitude", latitude.toString());
      form.setValue("longitude", longitude.toString());
    }
  }, [latitude, longitude]);

  const handleAutoLocate = () => {
    if (latitude && longitude) {
      form.setValue("latitude", latitude.toString());
      form.setValue("longitude", longitude.toString());
      toast({
        title: "Location Updated",
        description: "Current location coordinates set successfully",
      });
    }
  };

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
      radius: "",
    },
  });

  const { mutate: createLocation, status } = useMutation({
    mutationFn: async (data: LocationFormValues) => {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          radius: parseInt(data.radius),
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="flex justify-end ">
        <DrawerTrigger asChild>
          <Button>Create Location</Button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <DrawerHeader className="bg-[#8cc640] text-white">
          <DrawerTitle className="text-sm text-white">
            Create New Location
          </DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={` flex flex-col justify-between h-full`}
          >
            <div className="grid sm:grid-cols-2 gap-6 py-4 px-6 ">
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
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter latitude" {...field} />
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
                      <Input placeholder="Enter longitude" {...field} />
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
                      <Input placeholder="Enter radius" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
