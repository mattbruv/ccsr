import { LingoArray, LingoObject, LingoString, LingoType } from "../parser/types";
import { MapData, MapDataType, MapMetadata, MapObject, MapObjectData, MapObjectItem, MapObjectLocation, MapObjectMessage, MapObjectMove, MapObjectVisibility, RecursivePartial } from "./types";

export function lingoArrayToMapData(array: LingoArray): MapData[] {
    const mapData: MapData[] = []

    for (const child of array.children) {
        if (child.type === LingoType.Object) {
            // If it looks like a metadata object, parse that
            if (child.properties.some(x => x.key.value.includes("roomid")))
                mapData.push(lingoToMetadata(child))
            // Otherwise, it's a game object
            else
                mapData.push(lingoToMapObject(child))
        }
    }

    return mapData
}

function lingoToMetadata(object: LingoObject): RecursivePartial<MapMetadata> {
    const metadata: RecursivePartial<MapMetadata> = {
        dataType: MapDataType.Metadata
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

function lingoObjectToMapObjectMove(object: LingoObject): RecursivePartial<MapObjectMove> {
    const move: RecursivePartial<MapObjectMove> = {};

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

function lingoObjectToMapObjectData(object: LingoObject): RecursivePartial<MapObjectData> {
    const data: RecursivePartial<MapObjectData> = {};

    for (const property of object.properties) {
        const key = property.key.value;
        const value = property.value;

        if (key === "#message" && value.type === LingoType.Array)
            data.message = lingoArrrayToMapObjectMessage(value);
        if (key === "#move" && value.type === LingoType.Object)
            data.move = lingoObjectToMapObjectMove(value);
        if (key === "#item" && value.type === LingoType.Object)
            data.item = lingoObjectToMapObjectItem(value)
    }

    return data;
}

function lingoObjectToMapObjectItem(object: LingoObject): RecursivePartial<MapObjectItem> {
    const item: RecursivePartial<MapObjectItem> = {};

    for (const property of object.properties) {
        const key = property.key.value;
        const value = property.value;

        if (key === "#name" && value.type === LingoType.String)
            item.name = value.value;
        if (key === "#type" && value.type === LingoType.Identifier)
            item.type = value.value;
        if (key === "#visi" && value.type === LingoType.Object)
            item.visi = lingoObjectToMapObjectVisibility(value);
        if (key === "#COND" && value.type === LingoType.Array)
            item.COND = lingoArrayToMapObjectCond(value);
    }

    return item;
}

function lingoObjectToMapObjectVisibility(object: LingoObject): RecursivePartial<MapObjectVisibility> {
    const visibility: RecursivePartial<MapObjectVisibility> = {};

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

function lingoArrayToMapObjectCond(array: LingoArray): string[] {
    return array.children
        .filter(child => child.type === LingoType.String)
        .map(child => (child as LingoString).value);
}


function lingoArrrayToMapObjectMessage(array: LingoArray): RecursivePartial<MapObjectMessage>[] {
    const messages: RecursivePartial<MapObjectMessage>[] = []

    for (const child of array.children) {
        if (child.type !== LingoType.Object) continue;

        const message: RecursivePartial<MapObjectMessage> = {}

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

function lingoArrayToLocation(array: LingoArray): RecursivePartial<MapObjectLocation> {
    const location: RecursivePartial<MapObjectLocation> = {};

    for (const [i, value] of array.children.entries()) {
        if (value.type === LingoType.Number) {
            if (i === 0) location.x = value.value;
            if (i === 1) location.y = value.value;
        }
    }

    return location;
}

function lingoToMapObject(object: LingoObject): RecursivePartial<MapObject> {

    const mapObject: RecursivePartial<MapObject> = {
        dataType: MapDataType.Object
    }

    for (const property of object.properties) {
        const key = property.key.value
        const value = property.value

        switch (value.type) {
            // Pull out all string values
            case LingoType.String: {
                switch (key) {
                    case "#member": mapObject.member = value.value; break;
                    case "#type": mapObject.type = value.value; break;
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