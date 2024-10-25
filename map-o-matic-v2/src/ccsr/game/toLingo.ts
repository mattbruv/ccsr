import { LingoArray, LingoIdentifier, LingoObject, LingoProperty, LingoType, LingoValue } from "../parser/types";
import { MapData, MapObject, MapObjectCond, MapObjectData, MapObjectItem, MapObjectLocation, MapObjectMessage, MapObjectMove, MapObjectVisibility } from "./types";

export function mapDataToLingo(mapData: MapData): LingoArray {
    const metadata: LingoObject = {
        type: LingoType.Object,
        properties: []
    }

    metadata.properties.push({ key: { type: LingoType.Identifier, value: "#roomid" }, value: { type: LingoType.String, value: mapData.metadata.roomid } })
    metadata.properties.push({ key: { type: LingoType.Identifier, value: "#roomStatus" }, value: { type: LingoType.Number, value: mapData.metadata.roomStatus } })

    const lingoArray: LingoArray = {
        type: LingoType.Array,
        children: [metadata, ...mapData.objects.map(mapObjectToLingo)]
    }

    return lingoArray
}

export function mapObjectToLingo(mapObject: MapObject): LingoObject {
    const properties: LingoProperty[] = [];

    properties.push({ key: { type: LingoType.Identifier, value: "#member" }, value: { type: LingoType.String, value: mapObject.member } });
    properties.push({ key: { type: LingoType.Identifier, value: "#type" }, value: { type: LingoType.Identifier, value: mapObject.type } });
    properties.push({ key: { type: LingoType.Identifier, value: "#location" }, value: mapObjectLocationToLingo(mapObject.location) });
    properties.push({ key: { type: LingoType.Identifier, value: "#width" }, value: { type: LingoType.Number, value: mapObject.width } });
    properties.push({ key: { type: LingoType.Identifier, value: "#WSHIFT" }, value: { type: LingoType.Number, value: mapObject.WSHIFT } });
    properties.push({ key: { type: LingoType.Identifier, value: "#height" }, value: { type: LingoType.Number, value: mapObject.height } });
    properties.push({ key: { type: LingoType.Identifier, value: "#HSHIFT" }, value: { type: LingoType.Number, value: mapObject.HSHIFT } });
    properties.push({ key: { type: LingoType.Identifier, value: "#data" }, value: mapObjectDataToLingo(mapObject.data) });

    return {
        type: LingoType.Object,
        properties
    };
}

function mapObjectLocationToLingo(location: MapObjectLocation): LingoArray {
    const children: LingoValue[] = [];

    children.push({ type: LingoType.Number, value: location.x });
    children.push({ type: LingoType.Number, value: location.y });

    return {
        type: LingoType.Array,
        children
    };
}

function mapObjectDataToLingo(data: MapObjectData): LingoObject {
    const properties: LingoProperty[] = [];

    properties.push({ key: { type: LingoType.Identifier, value: "#item" }, value: mapObjectItemToLingo(data.item) });
    properties.push({ key: { type: LingoType.Identifier, value: "#move" }, value: mapObjectMoveToLingo(data.move) });
    properties.push({ key: { type: LingoType.Identifier, value: "#message" }, value: mapObjectMessagesToLingo(data.message) });

    return {
        type: LingoType.Object,
        properties
    };
}

function mapObjectItemToLingo(item: MapObjectItem): LingoObject {
    const properties: LingoProperty[] = [];

    properties.push({ key: { type: LingoType.Identifier, value: "#name" }, value: { type: LingoType.String, value: item.name } });
    properties.push({ key: { type: LingoType.Identifier, value: "#type" }, value: { type: LingoType.Identifier, value: item.type } });
    properties.push({ key: { type: LingoType.Identifier, value: "#visi" }, value: mapObjectVisibilityToLingo(item.visi) });
    properties.push({ key: { type: LingoType.Identifier, value: "#COND" }, value: mapObjectCondArrayToLingo(item.COND) });

    return {
        type: LingoType.Object,
        properties
    };
}

function mapObjectMoveToLingo(move: MapObjectMove): LingoObject {
    const properties: LingoProperty[] = [];

    properties.push({ key: { type: LingoType.Identifier, value: "#U" }, value: { type: LingoType.Number, value: move.U } });
    properties.push({ key: { type: LingoType.Identifier, value: "#d" }, value: { type: LingoType.Number, value: move.d } });
    properties.push({ key: { type: LingoType.Identifier, value: "#L" }, value: { type: LingoType.Number, value: move.L } });
    properties.push({ key: { type: LingoType.Identifier, value: "#R" }, value: { type: LingoType.Number, value: move.R } });
    properties.push({ key: { type: LingoType.Identifier, value: "#COND" }, value: { type: LingoType.Number, value: move.COND } });
    properties.push({ key: { type: LingoType.Identifier, value: "#TIMEA" }, value: { type: LingoType.Number, value: move.TIMEA } });
    properties.push({ key: { type: LingoType.Identifier, value: "#TIMEB" }, value: { type: LingoType.Number, value: move.TIMEB } });

    return {
        type: LingoType.Object,
        properties
    };
}

function mapObjectMessagesToLingo(messages: MapObjectMessage[]): LingoArray {
    const children: LingoValue[] = messages.map(message => {
        const properties: LingoProperty[] = [];

        properties.push({ key: { type: LingoType.Identifier, value: "#text" }, value: { type: LingoType.String, value: message.text } });
        properties.push({ key: { type: LingoType.Identifier, value: "#plrObj" }, value: { type: LingoType.String, value: message.plrObj } });
        properties.push({ key: { type: LingoType.Identifier, value: "#plrAct" }, value: { type: LingoType.String, value: message.plrAct } });

        return { type: LingoType.Object, properties };
    });

    return {
        type: LingoType.Array,
        children
    };
}

function mapObjectVisibilityToLingo(visi: MapObjectVisibility): LingoObject {
    const properties: LingoProperty[] = [];

    properties.push({ key: { type: LingoType.Identifier, value: "#visiObj" }, value: { type: LingoType.String, value: visi.visiObj } });
    properties.push({ key: { type: LingoType.Identifier, value: "#visiAct" }, value: { type: LingoType.String, value: visi.visiAct } });
    properties.push({ key: { type: LingoType.Identifier, value: "#inviObj" }, value: { type: LingoType.String, value: visi.inviObj } });
    properties.push({ key: { type: LingoType.Identifier, value: "#inviAct" }, value: { type: LingoType.String, value: visi.inviAct } });

    return {
        type: LingoType.Object,
        properties
    };
}


function mapObjectCondArrayToLingo(condArray: (MapObjectCond | null)[]): LingoArray {

    const children: LingoValue[] = condArray.map(cond => {
        if (!cond) {
            const nullValue: LingoIdentifier = {
                type: LingoType.Identifier,
                value: "#none"
            }
            return nullValue;
        }

        const properties: LingoProperty[] = [];

        properties.push({ key: { type: LingoType.Identifier, value: "#hasObj" }, value: { type: LingoType.String, value: cond.hasObj } });
        properties.push({ key: { type: LingoType.Identifier, value: "#hasAct" }, value: { type: LingoType.String, value: cond.hasAct } });
        properties.push({ key: { type: LingoType.Identifier, value: "#giveObj" }, value: { type: LingoType.String, value: cond.giveObj } });
        properties.push({ key: { type: LingoType.Identifier, value: "#giveAct" }, value: { type: LingoType.String, value: cond.giveAct } });

        return { type: LingoType.Object, properties };
    });

    return {
        type: LingoType.Array,
        children
    };
}
