import { useQuery } from "@tanstack/react-query";
import { login } from "../MusicView/api/users";

export default function useSession() {
    let enabled = false;

    if (
        localStorage.getItem("mv_user_email") &&
        localStorage.getItem("mv_user_secret")
    ) {
        enabled = true;
    }

    const queryParameter = {
        queryKey: ["session"],
        queryFn: () => {
            return login({
                email: localStorage.getItem("mv_user_email"),
                password: localStorage.getItem("mv_user_secret"),
            });
        },
        staleTime: 30 * 60 * 1000,
        refetchInterval: 30 * 59 * 1000,
        retry: 1,
        enabled,
    };

    return useQuery(queryParameter);
    // return useQuery({queryKey: ['session'], queryFn: () => {return login({
    //     email: localStorage.getItem("mv_user_email")?  localStorage.getItem("mv_user_email") as string : "a",
    //     password: localStorage.getItem("mv_user_secret")?  localStorage.getItem("mv_user_secret") as string : "a"

    // })}})
}
