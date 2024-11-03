import { parseMap } from "../parser/parser";
import { LingoArray, LingoObject, LingoType } from "../parser/types";
import { MapData, MapDataType, MapMetadata, MapObject, MapObjectCond, MapObjectData, MapObjectItem, MapObjectLocation, MapObjectMessage, MapObjectMove, MapObjectMoveCond, MapObjectType, MapObjectVisibility } from "./types";

export function stringToMapData(text: string): MapData | undefined {
    const parsed = parseMap(text)

    if (parsed.value.type === LingoType.Array) {
        return lingoArrayToMapData(parsed.value)
    }

    return undefined;
}

export function lingoArrayToMapData(array: LingoArray): MapData {
    const mapData: MapData = {
        metadata: {
            dataType: MapDataType.Metadata,
            roomid: "",
            roomStatus: 0
        },
        objects: []
    }

    for (const child of array.children) {
        if (child.type === LingoType.Object) {
            // If it looks like a metadata object, parse that
            if (child.properties.some(x => x.key.value.includes("roomid")))
                mapData.metadata = lingoToMetadata(child)
            // Otherwise, it's a game object
            else
                mapData.objects.push(lingoToMapObject(child))
        }
    }

    return mapData
}

function lingoToMetadata(object: LingoObject): MapMetadata {
    const metadata: MapMetadata = {
        dataType: MapDataType.Metadata,
        roomid: "",
        roomStatus: 0
    }

    for (const property of object.properties) {
        const key = property.key.value;
        const value = property.value;

        if (key === "#roomid" && value.type == LingoType.String)
            metadata.roomid = value.value;
        if (key === "#roomStatus" && value.type === LingoType.Number)
            metadata.roomStatus = value.value;
    }

    return metadata;
}

function lingoObjectToMapObjectMove(object: LingoObject): MapObjectMove {
    const move: MapObjectMove = {
        U: 0,
        d: 0,
        L: 0,
        R: 0,
        COND: MapObjectMoveCond.Auto,
        TIMEA: 0,
        TIMEB: 0
    };

    for (const property of object.properties) {
        const key = property.key.value;
        const value = property.value;

        if (value.type === LingoType.Number) {
            switch (key) {
                case "#U": move.U = value.value; break;
                case "#d": move.d = value.value; break;
                case "#L": move.L = value.value; break;
                case "#R": move.R = value.value; break;
                case "#COND": move.COND = value.value; break;
                case "#TIMEA": move.TIMEA = value.value; break;
                case "#TIMEB": move.TIMEB = value.value; break;
            }
        }
    }

    return move;
}

function lingoObjectToMapObjectData(object: LingoObject): MapObjectData {
    const data: MapObjectData = {
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
            COND: MapObjectMoveCond.Auto,
            TIMEA: 0,
            TIMEB: 0
        },
        message: []
    };

    for (const property of object.properties) {
        const key = property.key.value;
        const value = property.value;

        if (key === "#message" && value.type === LingoType.Array)
            data.message = lingoArrayToMapObjectMessage(value);
        if (key === "#move" && value.type === LingoType.Object)
            data.move = lingoObjectToMapObjectMove(value);
        if (key === "#item" && value.type === LingoType.Object)
            data.item = lingoObjectToMapObjectItem(value)
    }

    return data;
}

function lingoObjectToMapObjectItem(object: LingoObject): MapObjectItem {
    const item: MapObjectItem = {
        name: "",
        type: MapObjectType.ITEM,
        visi: {
            visiObj: "",
            visiAct: "",
            inviObj: "",
            inviAct: ""
        },
        COND: []
    };

    for (const property of object.properties) {
        const key = property.key.value;
        const value = property.value;

        if (key === "#name" && value.type === LingoType.String)
            item.name = value.value;
        if (key === "#type" && value.type === LingoType.Identifier)
            item.type = value.value as MapObjectType;
        if (key === "#visi" && value.type === LingoType.Object)
            item.visi = lingoObjectToMapObjectVisibility(value);
        if (key === "#COND" && value.type === LingoType.Array)
            item.COND = lingoArrayToMapObjectCond(value);
    }

    return item;
}

function lingoObjectToMapObjectVisibility(object: LingoObject): MapObjectVisibility {
    const visibility: MapObjectVisibility = {
        visiObj: "",
        visiAct: "",
        inviObj: "",
        inviAct: ""
    };

    for (const property of object.properties) {
        const key = property.key.value;
        const value = property.value;

        if (key === "#visiObj" && value.type === LingoType.String)
            visibility.visiObj = value.value;
        if (key === "#visiAct" && value.type === LingoType.String)
            visibility.visiAct = value.value;
        if (key === "#inviObj" && value.type === LingoType.String)
            visibility.inviObj = value.value;
        if (key === "#inviAct" && value.type === LingoType.String)
            visibility.inviAct = value.value;
    }

    return visibility;
}

function lingoArrayToMapObjectCond(array: LingoArray): (MapObjectCond | null)[] {
    const conds: (MapObjectCond | null)[] = [];

    for (const child of array.children) {
        if (child.type !== LingoType.Object) {
            conds.push(null);
            continue;
        }

        const condObj = child;
        const cond: MapObjectCond = {
            hasObj: "",
            hasAct: "",
            giveObj: "",
            giveAct: ""
        };

        for (const property of condObj.properties) {
            const key = property.key.value;
            const value = property.value;

            if (value.type !== LingoType.String) continue;

            switch (key) {
                case "#hasObj": cond.hasObj = value.value; break;
                case "#hasAct": cond.hasAct = value.value; break;
                case "#giveObj": cond.giveObj = value.value; break;
                case "#giveAct": cond.giveAct = value.value; break;
            }
        }

        conds.push(cond);
    }

    // Filter out null values for the sake of keeping a clean array
    // We'll add up to 4 null values back on export to match the original map data.
    return conds.filter(x => x !== null);
}



function lingoArrayToMapObjectMessage(array: LingoArray): MapObjectMessage[] {
    const messages: MapObjectMessage[] = []

    for (const child of array.children) {
        if (child.type !== LingoType.Object) continue;

        const message: MapObjectMessage = {
            text: "",
            plrObj: "",
            plrAct: ""
        }

        for (const property of child.properties) {
            const key = property.key.value;
            const value = property.value;
            if (value.type !== LingoType.String) continue;
            if (key === "#text") message.text = value.value;
            if (key === "#plrObj") message.plrObj = value.value;
            if (key === "#plrAct") message.plrAct = value.value;
        }

        messages.push(message)
    }

    return messages;
}

function lingoArrayToLocation(array: LingoArray): MapObjectLocation {
    const location: MapObjectLocation = {
        x: 0,
        y: 0
    };

    for (const [i, value] of array.children.entries()) {
        if (value.type === LingoType.Number) {
            if (i === 0) location.x = value.value;
            if (i === 1) location.y = value.value;
        }
    }

    return location;
}

function lingoToMapObject(object: LingoObject): MapObject {

    const mapObject: MapObject = {
        render: {
            outline: false,
            alpha: 1
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
                COND: MapObjectMoveCond.Auto,
                TIMEA: 0,
                TIMEB: 0
            },
            message: []
        },
    }

    for (const property of object.properties) {
        const key = property.key.value
        const value = property.value

        switch (value.type) {

            case LingoType.Identifier: {
                switch (key) {
                    case "#type": mapObject.type = value.value as MapObjectType; break;
                }
                break;
            }
            case LingoType.String: {
                switch (key) {
                    case "#member": mapObject.member = value.value; break;
                }
                break;
            }
            case LingoType.Number: {
                switch (key) {
                    case "#width": mapObject.width = value.value; break;
                    case "#height": mapObject.height = value.value; break;
                    case "#WSHIFT": mapObject.WSHIFT = value.value; break;
                    case "#HSHIFT": mapObject.HSHIFT = value.value; break;
                }
                break;
            }
            case LingoType.Array: {
                switch (key) {
                    case "#location": mapObject.location = lingoArrayToLocation(value); break;
                }
                break;
            }
            case LingoType.Object: {
                switch (key) {
                    case "#data": mapObject.data = lingoObjectToMapObjectData(value); break;
                }
                break;
            }
        }
    }

    return mapObject;
}