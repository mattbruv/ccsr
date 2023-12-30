import { LingoArray, LingoObject, LingoType } from "../parser/types";
import { MapData, MapDataType, MapMetadata, MapObject, MapObjectData, MapObjectLocation, MapObjectMessage, RecursivePartial } from "./types";

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

function lingoObjectToMapObjectData(object: LingoObject): RecursivePartial<MapObjectData> {
    const data: RecursivePartial<MapObjectData> = {};

    for (const property of object.properties) {
        const key = property.key.value;
        const value = property.value;

        if (key === "#message" && value.type === LingoType.Array)
            data.message = lingoArrrayToMapObjectMessage(value);
    }

    return data;
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