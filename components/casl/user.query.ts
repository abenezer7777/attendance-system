import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const fetchCurrentUser = async (): Promise<any> => {
  const { data } = await axios.get("api/me");
  return data;
};
export const useGetCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });
};
