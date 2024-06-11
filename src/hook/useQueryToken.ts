import { useQuery } from "@tanstack/react-query";
import getNewToken from "../MusicView/api/updateToken";
export default function useQueryToken() {
    return useQuery({queryKey: ['token'], queryFn: getNewToken, staleTime: 3300000, refetchInterval: 3300000})
}