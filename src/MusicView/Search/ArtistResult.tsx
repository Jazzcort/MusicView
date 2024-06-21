import { Link } from "react-router-dom";
export default function ArtistResult({ artists }: { artists: any[] }) {
    return (
        <>
            {artists.length !== 0 && <h2>Artists</h2>}
            <div id="mv-search-result-artist" className="d-flex flex-column flex-sm-row flex-wrap">
                {artists.map((item: any) => (
                    <Artist key={item.id} artist={item} />
                ))}
            </div>
        </>
    );
}

function Artist({ artist }: { artist: any }) {
    return (
        <div className="card m-2 artist-square">
            <img
                src={
                    artist.images[0]
                        ? artist.images[0].url
                        : "/images/logic-board.jpg"
                }
                className="card-img-top"
            />
            <div className="mv-search-card card-body">
                <h5 className="card-title overflow-x-hidden">{artist.name}</h5>
                <p className="card-text">Artist</p>
                <Link
                    to={`/Artist/${artist.id}`}
                    className="mv-search-button btn"
                >
                    To Artist
                </Link>
            </div>
        </div>
    );
}
