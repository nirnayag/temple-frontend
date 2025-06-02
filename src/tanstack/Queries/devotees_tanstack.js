import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { devoteeService } from "services/api";
import { DevoteeTanstackKeys } from "tanstack/Keys/DevoteeTanstackKeys";
import { toast } from "react-toastify";
export const useGetAllDevotees = () => {
  return useQuery({
    queryKey: [DevoteeTanstackKeys.get_All_Devotees_key],
    refetchOnWindowFocus: false, // Optional: prevents refetching on window focus
    queryFn: async () => {
      const res = await devoteeService.getAll();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes: how long data is fresh
    cacheTime: 30 * 60 * 1000, // 30 minutes: unused data stays cached
    // refetchOnWindowFocus: false, // prevent auto refetch when tab gets focus
    // refetchOnMount: false, // prevent refetch on remount if data is fresh
    // refetchOnReconnect: false, // prevent refetch on network reconnect
  });
};

export const useAddDevotee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await devoteeService.create(data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Devotee has been added");
      queryClient.invalidateQueries([DevoteeTanstackKeys.get_All_Devotees_key]); // Invalidate the events query to refetch data
    },
    onError: (error) => {
      toast.error("Error while adding a devotee", error);
    },
  });
};
export const useDeleteDevotee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => {
      const res = await devoteeService.delete(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([DevoteeTanstackKeys.get_All_Devotees_key]); // Invalidate the events query to refetch data
    },
    onError: (error) => {
      toast.error("Error while adding a devotee", error);
    },
  });
};

export const useEditDevotee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await devoteeService.update(id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([DevoteeTanstackKeys.get_All_Devotees_key]); // Invalidate the events query to refetch data
    },
    onError: (error) => {
      toast.error("Error while adding a devotee", error);
    },
  });
};
