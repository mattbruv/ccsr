import { MapDataType, MapObject, MapObjectMoveCond, MapObjectType } from "./game/types"
import { MapFile } from "./types"

export function base64toSrc(base64data: string): string {
    return "data:image/png;base64," + base64data
}

export function filenameFromPath(path: string) {
    return path.split("/").at(-1) ?? ""
}

export function newMapObject(): MapObject {
    return {
        render: {
            outline: false,
            alpha: 1,
        },
        random_id: crypto.randomUUID(),
        dataType: MapDataType.Object,
        id: 0,
        member: "",
        type: MapObjectType.FLOR,
        location: {
            x: 0,
            y: 0
        },
        width: 0,
        WSHIFT: 0,
        height: 0,
        HSHIFT: 0,
        data: {
            item: {
                name: "",
                type: MapObjectType.FLOR,
                visi: {
                    visiObj: "",
                    visiAct: "",
                    inviObj: "",
                    inviAct: ""
                },
                COND: []
            },
            move: {
                U: 0,
                d: 0,
                L: 0,
                R: 0,
                COND: MapObjectMoveCond.None,
                TIMEA: 0,
                TIMEB: 0
            },
            message: []
        },
    }
}

export function newMapFile(): MapFile {
    const map: MapFile = {
        filename: "",
        render: {
            showMap: true,
            showMapGrid: true,
            showMapBorder: true,
            showCollision: false,
            collisionAlpha: 0.5
        },
        file_text: "",
        data: {
            metadata: {
                dataType: MapDataType.Metadata,
                roomid: "",
                roomStatus: 0
            },
            objects: []
        },
        random_id: crypto.randomUUID(),
        trashedObjects: []
    }

    return map
}
