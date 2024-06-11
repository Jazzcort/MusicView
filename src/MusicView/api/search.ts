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

    if (!id) {
        throw new Error("Couldn't find artist without artist ID");
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

export async function getArtistTopTracks(
    artistId: string | undefined,
    token: string
) {
    if (!artistId) {
        throw new Error("Couldn't find top tracks without artist ID");
    }

    const artistParameter = {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
        timeout: 20000,
    };

    const res = await axios(artistParameter);
    return res;
}

export async function getArtistAlbum(
    artistId: string | undefined,
    token: string
) {
    if (!artistId) {
        throw new Error("Couldn't find albums without artist ID");
    }

    const artistParameter = {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        url: `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single`,
        timeout: 20000,
    };

    const res = await axios(artistParameter);
    return res;
}

export async function getAlbumWithId(albumId: string | undefined, token: string) {
    if (!albumId) {
        throw new Error("Couldn't find album without album ID");
    }

    const albumParameter = {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        url: `https://api.spotify.com/v1/albums/${albumId}`,
        timeout: 20000,
    };

    const res = await axios(albumParameter);
    return res;

}

export default search;
