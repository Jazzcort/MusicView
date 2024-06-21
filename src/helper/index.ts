export function getDurationFormat(duration: number) {
    const second = Math.floor((duration % 60000) / 1000);
    return `${Math.floor(duration / 60000)}:${
        second >= 10 ? second : "0" + second
    }`;
}

export function isBlank(str: string | null) {
    return !str || /^\s*$/.test(str);
}
