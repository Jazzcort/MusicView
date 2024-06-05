import { Link } from "react-router-dom";
export default function ArtistResult({ artists }: { artists: any[] }) {
    return (
        <>
        { artists.length !== 0 && <h2>Artists</h2>}
        <div id="mv-search-result-artist" className="d-flex flex-wrap">
            {artists.map((item: any) => <Artist key={item.id} artist={item}/>)}
        </div>
        </>
    );
}

function Artist({artist} : {artist: any}) {
    return (
        <div className="card m-2" style={{width: "250px"}}>
            <img src={artist.images[0]? artist.images[0].url: "/images/logic-board.jpg"} className="card-img-top" style={{height: "220px"}} />
            <div className="card-body">
                <h5 className="card-title">{artist.name}</h5>
                <p className="card-text">
                    Artist
                </p>
                <Link to={`/Artist/${artist.id}`} className="btn btn-primary">To Artist</Link>
            </div>
        </div>
    );
}
