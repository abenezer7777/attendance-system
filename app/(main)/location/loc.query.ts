import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const fetchLocations = async () => {
  const { data } = await axios.get(`${baseUrl}/api/locations`);
  return data;
};

export const useGetLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
};

// const getLocationsOnOrgnization = async (organizationId: string) => {
//   const { data } = await axios.get(
//     `${baseUrl}/api/locations?organizationId=${organizationId}`
//   );
//   return data;
// };

// export const useGetLocationsOnOrgnization = (organizationId: string) => {
//   return useQuery({
//     queryKey: ["locations", organizationId],
//     queryFn: () => getLocationsOnOrgnization(organizationId),
//   });
// };
