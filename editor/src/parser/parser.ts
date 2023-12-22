//import test from "./0106.txt?raw";
import test from "./test.txt?raw";
import { getTokens } from "./tokens";

export default test;

const result = getTokens(test);
console.log(result);
