import { LuDot } from "react-icons/lu";
export default function TracksResult({ tracks }: { tracks: any[] }) {
    return (
        <>
            {tracks.length !== 0 && <h2>Tracks</h2>}
            <div id="mv-search-result-track" className="d-flex flex-wrap">
                {tracks.map((item) => (
                    <Track key={item.id} track={item} />
                ))}
            </div>
        </>
    );
}

function Track({ track }: { track: any }) {
    return (
        <div className="card m-2" style={{ width: "250px" }}>
            <img
                src={
                    track.album?.images[0]
                        ? track.album.images[0].url
                        : "/images/logic-board.jpg"
                }
                className="card-img-top"
                style={{ height: "220px" }}
            />
            <div className="card-body">
                <h5 className="card-title">{track.name}</h5>
                <p className="card-text">
                    {track.album?.name ? track.album.name : "unknown"} <LuDot />{" "}
                    {track.artists[0] ? track.artists[0].name : "unknown"}{" "}
                </p>
                <a href="#" className="btn btn-primary">
                    Go somewhere
                </a>
            </div>
        </div>
    );
}
