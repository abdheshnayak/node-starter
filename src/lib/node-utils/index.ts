import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const _filename = (a: any) => fileURLToPath(a);
export const _dirname = (a: any) => dirname(_filename(a));
