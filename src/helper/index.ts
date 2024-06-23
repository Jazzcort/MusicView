export function getDurationFormat(duration: number) {
    const second = Math.floor((duration % 60000) / 1000);
    return `${Math.floor(duration / 60000)}:${
        second >= 10 ? second : "0" + second
    }`;
}

export function isBlank(str: string | null) {
    return !str || /^\s*$/.test(str);
}

export function checkResult(result: any) {
    let artists = false;

    if (result.artists) {
        if (result.artists.items.length !== 0) {
            artists = true;
        }
    }

    let albums = false;

    if (result.albums) {
        if (result.albums.items.length !== 0) {
            albums = true;
        }
    }

    let tracks = false;

    if (result.tracks) {
        if (result.tracks.items.length !== 0) {
            tracks = true;
        }
    }

    if (!artists && !albums && !tracks) {
        return false;
    }
    return true;
}
