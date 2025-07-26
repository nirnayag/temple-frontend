import { useQuery } from "@tanstack/react-query";
import authService from "services/auth";
import { ProfileTanstackKeys } from "tanstack/Keys/ProfileTanstackKeys";
export const useGetProfile = () => {
  return useQuery({
    queryKey: [ProfileTanstackKeys.get_Profile_key],
    queryFn: async () => {
      const res = await authService.getProfile();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes: how long data is fresh
    cacheTime: 30 * 60 * 1000, // 30 minutes: unused data stays cached
    refetchOnWindowFocus: false, // prevent auto refetch when tab gets focus
    // refetchOnMount: false, // prevent refetch on remount if data is fresh
    // refetchOnReconnect: false, // prevent refetch on network reconnect
  });
};
