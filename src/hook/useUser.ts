import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../MusicView/api/users";
export default function (session_id: string) {

    let enabled = false;

    if (session_id) {
        enabled = true;
    }

    return useQuery({
        queryKey: ["user"],
        queryFn: () => {
            return getUserInfo(session_id);
        },
        retry: 1,
        staleTime: 24 * 60 * 60 * 1000,
        enabled
    });
}
