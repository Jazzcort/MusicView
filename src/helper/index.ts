export function getDurationFormat(duration: number) {
    const second = Math.floor((duration % 60000) / 1000);
    return `${Math.floor(duration / 60000)}:${
        second >= 10 ? second : "0" + second
    }`;
}
