// src/hooks/useProducts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventService } from "services/api";
import { toast } from "react-toastify";
import { EventTanstackKeys } from "tanstack/Keys/EventTanstackKeys";

export const useGetAllEvents = () => {
  return useQuery({
    queryKey: [EventTanstackKeys.get_All_Events_key], // key to identify this data in the cache
    queryFn: async () => {
      const res = await eventService.getAll();
      return res.data;
    },
    refetchOnWindowFocus: false, // Optional: prevents refetching on window focus
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await eventService.create(formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries([EventTanstackKeys.get_All_Events_key]); // Invalidate the events query to refetch data
      // navigate("/admin/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to create event");
      console.warn("Error creating event:", error);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId) => {
      const response = await eventService.delete(eventId);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries([EventTanstackKeys.get_All_Events_key]); // Invalidate the events query to refetch data
      // Optionally, you can invalidate queries to refetch data
      // queryClient.invalidateQueries(["getAllEvents"]);
    },
    onError: (error) => {
      toast.error("Failed to delete event");
      console.warn("Error deleting event:", error);
    },
  });
};
