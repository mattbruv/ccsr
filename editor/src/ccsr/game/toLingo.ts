import { LingoArray, LingoIdentifier, LingoObject, LingoProperty, LingoType, LingoValue } from "../parser/types";
import { MapObject, MapObjectCond, MapObjectCondArray, MapObjectData, MapObjectItem, MapObjectLocation, MapObjectMessage, MapObjectMove, MapObjectVisibility, RecursivePartial } from "./types";

export function mapObjectToLingo(mapObject: RecursivePartial<MapObject>): LingoObject {
    const properties: LingoProperty[] = [];

    if (mapObject.member !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#member" }, value: { type: LingoType.String, value: mapObject.member } });
    }
    if (mapObject.type !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#type" }, value: { type: LingoType.String, value: mapObject.type } });
    }
    if (mapObject.location !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#location" }, value: mapObjectLocationToLingo(mapObject.location) });
    }
    if (mapObject.width !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#width" }, value: { type: LingoType.Number, value: mapObject.width } });
    }
    if (mapObject.WSHIFT !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#WSHIFT" }, value: { type: LingoType.Number, value: mapObject.WSHIFT } });
    }
    if (mapObject.height !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#height" }, value: { type: LingoType.Number, value: mapObject.height } });
    }
    if (mapObject.HSHIFT !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#HSHIFT" }, value: { type: LingoType.Number, value: mapObject.HSHIFT } });
    }
    if (mapObject.data !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#data" }, value: mapObjectDataToLingo(mapObject.data) });
    }

    return {
        type: LingoType.Object,
        properties
    };
}

function mapObjectLocationToLingo(location: RecursivePartial<MapObjectLocation>): LingoArray {
    const children: LingoValue[] = [];

    if (location.x !== undefined) {
        children.push({ type: LingoType.Number, value: location.x });
    }
    if (location.y !== undefined) {
        children.push({ type: LingoType.Number, value: location.y });
    }

    return {
        type: LingoType.Array,
        children
    };
}

function mapObjectDataToLingo(data: RecursivePartial<MapObjectData>): LingoObject {
    const properties: LingoProperty[] = [];

    if (data.item !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#item" }, value: mapObjectItemToLingo(data.item) });
    }
    if (data.move !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#move" }, value: mapObjectMoveToLingo(data.move) });
    }
    if (data.message !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#message" }, value: mapObjectMessagesToLingo(data.message) });
    }

    return {
        type: LingoType.Object,
        properties
    };
}

function mapObjectItemToLingo(item: RecursivePartial<MapObjectItem>): LingoObject {
    const properties: LingoProperty[] = [];

    if (item.name !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#name" }, value: { type: LingoType.String, value: item.name } });
    }
    if (item.type !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#type" }, value: { type: LingoType.String, value: item.type } });
    }
    if (item.visi !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#visi" }, value: mapObjectVisibilityToLingo(item.visi) });
    }
    if (item.COND !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#COND" }, value: mapObjectCondArrayToLingo(item.COND) });
    }

    return {
        type: LingoType.Object,
        properties
    };
}

function mapObjectMoveToLingo(move: RecursivePartial<MapObjectMove>): LingoObject {
    const properties: LingoProperty[] = [];

    if (move.U !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#U" }, value: { type: LingoType.Number, value: move.U } });
    }
    if (move.d !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#d" }, value: { type: LingoType.Number, value: move.d } });
    }
    if (move.L !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#L" }, value: { type: LingoType.Number, value: move.L } });
    }
    if (move.R !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#R" }, value: { type: LingoType.Number, value: move.R } });
    }
    if (move.COND !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#COND" }, value: { type: LingoType.Number, value: move.COND } });
    }
    if (move.TIMEA !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#TIMEA" }, value: { type: LingoType.Number, value: move.TIMEA } });
    }
    if (move.TIMEB !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#TIMEB" }, value: { type: LingoType.Number, value: move.TIMEB } });
    }

    return {
        type: LingoType.Object,
        properties
    };
}

function mapObjectMessagesToLingo(messages: RecursivePartial<MapObjectMessage>[]): LingoArray {
    const children: LingoValue[] = messages.map(message => {
        const properties: LingoProperty[] = [];

        if (message.text !== undefined) {
            properties.push({ key: { type: LingoType.Identifier, value: "#text" }, value: { type: LingoType.String, value: message.text } });
        }
        if (message.plrObj !== undefined) {
            properties.push({ key: { type: LingoType.Identifier, value: "#plrObj" }, value: { type: LingoType.String, value: message.plrObj } });
        }
        if (message.plrAct !== undefined) {
            properties.push({ key: { type: LingoType.Identifier, value: "#plrAct" }, value: { type: LingoType.String, value: message.plrAct } });
        }

        return { type: LingoType.Object, properties };
    });

    return {
        type: LingoType.Array,
        children
    };
}

function mapObjectVisibilityToLingo(visi: RecursivePartial<MapObjectVisibility>): LingoObject {
    const properties: LingoProperty[] = [];

    if (visi.visiObj !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#visiObj" }, value: { type: LingoType.String, value: visi.visiObj } });
    }
    if (visi.visiAct !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#visiAct" }, value: { type: LingoType.String, value: visi.visiAct } });
    }
    if (visi.inviObj !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#inviObj" }, value: { type: LingoType.String, value: visi.inviObj } });
    }
    if (visi.inviAct !== undefined) {
        properties.push({ key: { type: LingoType.Identifier, value: "#inviAct" }, value: { type: LingoType.String, value: visi.inviAct } });
    }

    return {
        type: LingoType.Object,
        properties
    };
}


function mapObjectCondArrayToLingo(condArray: RecursivePartial<MapObjectCondArray>): LingoArray {
    const children: LingoValue[] = condArray.map(cond => {
        if (!cond) {
            const nullValue: LingoIdentifier = {
                type: LingoType.Identifier,
                value: "#none"
            }
            return nullValue;
        }

        const properties: LingoProperty[] = [];

        if (cond.hasObj !== undefined) {
            properties.push({ key: { type: LingoType.Identifier, value: "#hasObj" }, value: { type: LingoType.String, value: cond.hasObj } });
        }
        if (cond.hasAct !== undefined) {
            properties.push({ key: { type: LingoType.Identifier, value: "#hasAct" }, value: { type: LingoType.String, value: cond.hasAct } });
        }
        if (cond.giveObj !== undefined) {
            properties.push({ key: { type: LingoType.Identifier, value: "#giveObj" }, value: { type: LingoType.String, value: cond.giveObj } });
        }
        if (cond.giveAct !== undefined) {
            properties.push({ key: { type: LingoType.Identifier, value: "#giveAct" }, value: { type: LingoType.String, value: cond.giveAct } });
        }

        return { type: LingoType.Object, properties };
    });

    return {
        type: LingoType.Array,
        children
    };
}
