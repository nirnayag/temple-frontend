import { useQuery } from "@tanstack/react-query";
import { devoteeService } from "services/api";
import { DevoteeTanstackKeys } from "tanstack/Keys/DevoteeTanstackKeys";

export const useGetAllDevotees = () => {
  return useQuery({
    queryKey: [DevoteeTanstackKeys.get_All_Devotees_key],
    refetchOnWindowFocus: false, // Optional: prevents refetching on window focus
    queryFn: async () => {
      const res = await devoteeService.getAll();
      return res.data;
    },
  });
};
