import { OrgLevel } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createOrganizationSchema } from "@/lib/schemas/validationSchema";
import { z } from "zod";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export type Organization = z.infer<typeof createOrganizationSchema>;
export type OrganizationDto = {
  level: OrgLevel;
  name: string;
  parentId?: string;
};

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const { data } = await axios.get(`${baseUrl}/api/organizations`);
  return data;
};
export const useGetAllOrganizationsForTable = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  });
};
const createOrganization = (createOrganizationDto: OrganizationDto) => {
  return axios
    .post(`${baseUrl}/api/organizations`, createOrganizationDto)
    .then(({ data }) => data);
};

const fetchOrg = async (
  level: string
): Promise<{ id: string; name: string; level: OrgLevel }[]> => {
  const { data } = await axios.get(`${baseUrl}/api/organizations/${level}`);
  return data;
};

export const useGetAllOrganizations = ({ level }: { level: OrgLevel }) => {
  return useQuery({
    queryKey: ["organizations", level],
    queryFn: () => fetchOrg(level),
  });
};
export const useCreateOrganizationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      // Invalidate the organizations query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};
