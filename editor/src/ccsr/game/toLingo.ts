import { LingoArray, LingoObject, LingoProperty, LingoType } from "../parser/types";
import { MapObjectCond, MapObjectCondArray, MapObjectData, MapObjectItem, MapObjectMessage, MapObjectMove, MapObjectVisibility } from "./types";

export function mapObjectDataToLingo(data: MapObjectData): LingoObject {
    const properties: LingoProperty[] = [
        { key: { type: LingoType.Identifier, value: "#item" }, value: mapObjectItemToLingo(data.item) },
        { key: { type: LingoType.Identifier, value: "#move" }, value: mapObjectMoveToLingo(data.move) },
        { key: { type: LingoType.Identifier, value: "#message" }, value: mapObjectMessagesToLingo(data.message) }
    ];

    return {
        type: LingoType.Object,
        properties
    };
}


function mapObjectItemToLingo(item: MapObjectItem): LingoObject {
    return {
        type: LingoType.Object,
        properties: [
            { key: { type: LingoType.Identifier, value: "#name" }, value: { type: LingoType.String, value: item.name } },
            { key: { type: LingoType.Identifier, value: "#type" }, value: { type: LingoType.String, value: item.type } },
            { key: { type: LingoType.Identifier, value: "#visi" }, value: mapObjectVisibilityToLingo(item.visi) },
            { key: { type: LingoType.Identifier, value: "#COND" }, value: mapObjectCondArrayToLingo(item.COND) }
        ]
    };
}

function mapObjectMoveToLingo(move: MapObjectMove): LingoObject {
    const properties: LingoProperty[] = Object.entries(move).map(([key, value]) => ({
        key: { type: LingoType.Identifier, value: `#${key}` },
        value: { type: LingoType.Number, value }
    }));

    return {
        type: LingoType.Object,
        properties
    };
}


function mapObjectMessagesToLingo(messages: MapObjectMessage[]): LingoArray {
    return {
        type: LingoType.Array,
        children: messages.map(message => ({
            type: LingoType.Object,
            properties: [
                { key: { type: LingoType.Identifier, value: "#text" }, value: { type: LingoType.String, value: message.text } },
                { key: { type: LingoType.Identifier, value: "#plrObj" }, value: { type: LingoType.String, value: message.plrObj } },
                { key: { type: LingoType.Identifier, value: "#plrAct" }, value: { type: LingoType.String, value: message.plrAct } }
            ]
        }))
    };
}

function mapObjectVisibilityToLingo(visi: MapObjectVisibility): LingoObject {
    return {
        type: LingoType.Object,
        properties: [
            { key: { type: LingoType.Identifier, value: "#visiObj" }, value: { type: LingoType.String, value: visi.visiObj } },
            { key: { type: LingoType.Identifier, value: "#visiAct" }, value: { type: LingoType.String, value: visi.visiAct } },
            { key: { type: LingoType.Identifier, value: "#inviObj" }, value: { type: LingoType.String, value: visi.inviObj } },
            { key: { type: LingoType.Identifier, value: "#inviAct" }, value: { type: LingoType.String, value: visi.inviAct } }
        ]
    };
}

function mapObjectCondArrayToLingo(condArray: MapObjectCondArray): LingoArray {
    return {
        type: LingoType.Array,
        children: condArray.map(cond => cond ? mapObjectCondToLingo(cond) : { type: LingoType.Identifier, value: "#none" })
    };
}

function mapObjectCondToLingo(cond: MapObjectCond): LingoObject {
    return {
        type: LingoType.Object,
        properties: [
            { key: { type: LingoType.Identifier, value: "#hasObj" }, value: { type: LingoType.String, value: cond.hasObj } },
            { key: { type: LingoType.Identifier, value: "#hasAct" }, value: { type: LingoType.String, value: cond.hasAct } },
            { key: { type: LingoType.Identifier, value: "#giveObj" }, value: { type: LingoType.String, value: cond.giveObj } },
            { key: { type: LingoType.Identifier, value: "#giveAct" }, value: { type: LingoType.String, value: cond.giveAct } }
        ]
    };
}
