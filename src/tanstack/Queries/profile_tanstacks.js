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
    refetchOnWindowFocus: false, // Optional: prevents refetching on window focus
  });
};
