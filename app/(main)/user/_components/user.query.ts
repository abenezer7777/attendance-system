import { createUserSchema } from "@/schemas/validationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
type CreateUserFormValues = z.infer<typeof createUserSchema>;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const fetchUsers = async () => {
  const { data } = await axios.get("/api/user");
  return data;
};
const fetchRole = async () => {
  const { data } = await axios.get("/api/role");
  return data;
};
export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRole,
  });
};
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};

const createUser = (createUserDto: CreateUserFormValues) => {
  return axios
    .post(`${baseUrl}/api/user`, createUserDto)
    .then(({ data }) => data);
};
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate the organizations query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
