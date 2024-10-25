import { LingoValue, LingoType, LingoObject, LingoArray, LingoLiteral } from "./types";

export function lingoValueToString(value: LingoValue, prettyPrint: boolean = false, asJSON = false, level: number = 0): string {
    const indent = prettyPrint ? '    '.repeat(level) : '';
    const newLine = prettyPrint ? '\n' : '';

    switch (value.type) {
        case LingoType.Object:
            return lingoObjectToString(value, prettyPrint, level);
        case LingoType.Array:
            return lingoArrayToString(value, prettyPrint, level);
        case LingoType.Identifier:
        case LingoType.String:
        case LingoType.Number:
            return lingoLiteralToString(value);
        default:
            return '';
    }

    function lingoObjectToString(obj: LingoObject, prettyPrint: boolean, level: number): string {
        const open = asJSON ? "{" : "[";
        const close = asJSON ? "}" : "]";

        const properties = obj.properties.map(property => {
            let keyString = `${property.key.value}`;
            if (asJSON) keyString = `"${keyString}"`
            keyString = `${keyString}: `
            const valueString = lingoValueToString(property.value, prettyPrint, asJSON, level + 1);
            return `${indent}${keyString}${valueString}`;
        }).join(`, ${newLine}`);

        return `${open}${newLine}${properties}${newLine}${indent}${close}`;
    }

    function lingoArrayToString(arr: LingoArray, prettyPrint: boolean, level: number): string {
        const elements = arr.children.map(child => {
            return `${indent}${lingoValueToString(child, prettyPrint, asJSON, level + 1)}`;
        }).join(`, ${newLine}`);
        return `[${newLine}${elements}${newLine}${indent}]`;
    }

    function lingoLiteralToString(literal: LingoLiteral): string {
        switch (literal.type) {
            case LingoType.Identifier:
                {
                    let value = `${literal.value}`;
                    if (asJSON) value = `"${value}"`
                    return value;
                }
            case LingoType.String:
                return `"${literal.value}"`;
            case LingoType.Number:
                return `${literal.value}`;
            default:
                return '';
        }
    }
}