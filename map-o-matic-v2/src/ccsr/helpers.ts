
export function base64toSrc(base64data: string): string {
    return "data:image/png;base64," + base64data
}

export function filenameFromPath(path: string) {
    return path.split("/").at(-1) ?? ""
}