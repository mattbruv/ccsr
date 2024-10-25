import { promises as fs } from "fs"
import { stringToMapData } from "../ccsr/game/fromLingo"
import { mapDataToLingo } from "../ccsr/game/toLingo"
import { lingoValueToString } from "../ccsr/parser/print"
import * as path from 'path';

async function loadMap(episode: string, map: string): Promise<string> {
    const file = await fs.readFile(path.join(__dirname, `../../../ccsr/${episode}/map.data/${map}.txt`));
    return file.toString();
}

describe("parser", () => {

    // Lots of original files seem to have some extra garbage at the end
    // in the original files, after the final closing brackets.
    // I've removed those from the test cases because obviously
    // our version isn't going to spit out garbage after the final bracket
    const files = {
        "1": ['0403', '0601', '0205', '0402', '0206', '0603', '0401', '0203', '0202', '0606', '0404', '0406', '0604', '0201', '0605', '0306', '0104', '0503', '0106', '0304', '0102', '0506', '0103', '0301', '0303', '0505', '0302'],
        //"2": ['0403', '0601', '0205', '0106b', '0204', '0402', '0602', '0206', '0603', '0401', '0405', '0203', '0202', '0606', '0404', '0406', '0604', '0201', '0605', '0306', '0104', '0702', '0501', '0703', '0105', '0305', '0701', '0503', '0502', '0106', '0304', '0102', '0704', '0506', '0506b', '0705', '0103', '0301', '0303', '0101', '0505', '0504', '0706', '0302'],
        //"3": ['0403', '0601', '0205', '0106b', '0204', '0402', '0602', '0206', '0603', '0401', '0405', '0203', '0202', '0606', '0404', '0406', '0604', '0201', '0605', '0306', '0104', '0702', '0501', '0703', '0105', '0305', '0701', '0503', '0502', '0106', '0304', '0102', '0704', '0506', '0506b', '0705', '0103', '0301', '0303', '0101', '0505', '0504', '0706', '0302'],
        //"4": ['0403', '0601', '0205', '0106b', '0204', '0402', '0602', '0206', '0603', '0401', '0405', '0203', '0202', '0606', '0404', '0406', '0604', '0201', '0605', '0306', '0104', '0702', '0501', '0703', '0105', '0305', '0701', '0503', '0502', '0106', '0304', '0102', '0704', '0506', '0506b', '0705', '0103', '0301', '0303', '0101', '0505', '0504', '0706', '0302'],
        //"scooby-1": ['0403', '0204', '0402', '0401', '0203', '0202', '0404', '0201', '0104', '0304', '0102', '0103', '0301', '0303', '0101', '0302'],
        //"scooby-2": ['0203', '0202', '0201', '0102', '0103', '0301', '0303', '0101', '0302']
    };

    for (const [episode, maps] of Object.entries(files)) {
        for (const map of maps) {
            test(`exporting map ${episode}-${map} matches original`, async () => {
                const original_map = (await loadMap(episode, map)).trim();
                const parsed = stringToMapData(original_map);
                const lingo = mapDataToLingo(parsed!);
                const exported = lingoValueToString(lingo, false, false).trim();
                expect(exported).toBe(original_map);
            });
        }
    }
});

