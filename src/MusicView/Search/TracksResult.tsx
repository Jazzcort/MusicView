import { LuDot } from "react-icons/lu";
import { Link } from "react-router-dom";
export default function TracksResult({ tracks }: { tracks: any[] }) {
    return (
        <>
            {tracks.length !== 0 && <h2>Tracks</h2>}
            <div id="mv-search-result-track" className="d-flex flex-column flex-sm-row flex-wrap">
                {tracks.map((item) => (
                    <Track key={item.id} track={item} />
                ))}
            </div>
        </>
    );
}

function Track({ track }: { track: any }) {
    return (
        <div className="card m-2 track-square">
            <img
                src={
                    track.album?.images[0]
                        ? track.album.images[0].url
                        : "/images/logic-board.jpg"
                }
                className="card-img-top"
            />
            <div className="card-body mv-search-card">
                <h5 className="card-title overflow-x-hidden">{track.name}</h5>
                <p className="card-text overflow-x-hidden">
                    {track.album?.name ? track.album.name : "unknown"} <LuDot />{" "}
                    {track.artists[0] ? track.artists[0].name : "unknown"}{" "}
                </p>
                <Link className="mv-search-button btn" to={`/Album/${track.album.id}`}>To Album</Link>
            </div>
        </div>
    );
}
