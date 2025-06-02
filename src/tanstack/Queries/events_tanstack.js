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
    staleTime: 5 * 60 * 1000, // 5 minutes: how long data is fresh
    cacheTime: 30 * 60 * 1000,
    // refetchOnWindowFocus: false, // prevent auto refetch when tab gets focus
    // refetchOnMount: false, // prevent refetch on remount if data is fresh
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
      toast.success("Event has been created");
      queryClient.invalidateQueries([EventTanstackKeys.get_All_Events_key]); // Invalidate the events query to refetch data
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
    },
    onError: (error) => {
      toast.error("Failed to delete event");
      console.warn("Error deleting event:", error);
    },
  });
};

export const useEditEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      // Ensure data is in the correct format for the API
      const response = await eventService.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Event updated successfully!");
      // Optionally, you can invalidate queries to refetch data
      queryClient.invalidateQueries([EventTanstackKeys.get_All_Events_key]);
    },
    onError: (error) => {
      toast.error("Failed to update event");
      console.warn("Error updating event:", error);
    },
  });
};
