import axios from "axios";

async function search(q: string, type: string, token: string) {
    const artistParameter = {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        url: `https://api.spotify.com/v1/search?q=${q}&${
            type ? "type=" + type : "type=album,artist,track"
        }&market=US`,
        timeout: 20000,
    };

    const res = await axios(artistParameter);
    return res;
}

export async function getArtistById(id: string | undefined, token: string) {
    // throw new Error("Random Error")

    if (!id) {
        throw new Error("Couldn't find artist without artist ID")
    }

    const artistParameter = {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        url: `https://api.spotify.com/v1/artists/${id}`,
        timeout: 20000,
    };

    const res = await axios(artistParameter);
    return res;
}

export default search;
