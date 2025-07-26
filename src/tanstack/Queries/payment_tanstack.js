import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { paymentService } from "services/api";
import { PaymentTanstackKeys } from "tanstack/Keys/PaymentTanstackKeys";

export const useGetAllPayments = () => {
  return useQuery({
    queryKey: [PaymentTanstackKeys.get_All_Payments_key], // key to identify this data in the cache
    queryFn: async () => {
      const res = await paymentService.getAll();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes: how long data is fresh
    cacheTime: 30 * 60 * 1000,
    // refetchOnWindowFocus: false, // prevent auto refetch when tab gets focus
    // refetchOnMount: false, // prevent refetch on remount if data is fresh
  });
};

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await paymentService.create(formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Event has been created");
      queryClient.invalidateQueries([PaymentTanstackKeys.get_All_Payments_key]); // Invalidate the events query to refetch data
    },
    onError: (error) => {
      toast.error("Failed to create event");
      console.warn("Error creating event:", error);
    },
  });
};

export const useEditPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await paymentService.update(formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Event has been created");
      queryClient.invalidateQueries([PaymentTanstackKeys.get_All_Payments_key]); // Invalidate the events query to refetch data
    },
    onError: (error) => {
      toast.error("Failed to create event");
      console.warn("Error creating event:", error);
    },
  });
};
