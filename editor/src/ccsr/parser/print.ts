import { LingoValue, LingoType, LingoObject, LingoArray, LingoLiteral } from "./types";

export function lingoValueToString(value: LingoValue, prettyPrint: boolean = false, level: number = 0): string {
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
        const properties = obj.properties.map(property => {
            const keyString = `"${property.key.value}": `;
            const valueString = lingoValueToString(property.value, prettyPrint, level + 1);
            return `${indent}    ${keyString}${valueString}`;
        }).join(`,${newLine}`);
        return `{${newLine}${properties}${newLine}${indent}}`;
    }

    function lingoArrayToString(arr: LingoArray, prettyPrint: boolean, level: number): string {
        const elements = arr.children.map(child => {
            return `${indent}    ${lingoValueToString(child, prettyPrint, level + 1)}`;
        }).join(`,${newLine}`);
        return `[${newLine}${elements}${newLine}${indent}]`;
    }

    function lingoLiteralToString(literal: LingoLiteral): string {
        switch (literal.type) {
            case LingoType.Identifier:
                return `${literal.value}`;
            case LingoType.String:
                return `"${literal.value}"`;
            case LingoType.Number:
                return `${literal.value}`;
            default:
                return '';
        }
    }
}