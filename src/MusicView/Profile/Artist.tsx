import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArtistById } from "../api/search";
import useQueryToken from "../../hook/useQueryToken";
export default function Artist({ artistId }: { artistId: string }) {
    const { data: token } = useQueryToken();

    const { data: artist, isLoading: artistIsLoading } = useQuery({
        queryKey: ["artist", artistId],
        queryFn: () => getArtistById(artistId, token),
        staleTime: 3300000,
        enabled: token ? true : false,
    });

    if (!artist || artistIsLoading) {
        return null
    }

    return (
        <div className="card m-2 profile-artist" >
            <img
                src={
                    artist.data?.images[0]
                        ? artist.data.images[0].url
                        : "/images/logic-board.jpg"
                }
                className="card-img-top"
            />
            <div className="mv-search-card card-body">
                <h5 className="card-title overflow-x-hidden">{artist.data?.name}</h5>
                <p className="card-text">Artist</p>
                <Link
                    to={`/Artist/${artist.data?.id}`}
                    className="mv-search-button btn"
                >
                    To Artist
                </Link>
            </div>
        </div>
    );
}
