import { RegexInterface } from "./interface";

export function serializeRegex(value: RegExp): RegexInterface {
    return {
        regex: value.source,
        flag: value.flags
    };
}

export function deserializeRegex(value: RegexInterface | string): RegExp {
    if (typeof value === 'string') {
        return new RegExp(value);
    }
    
    return new RegExp(value.regex, value.flag);
}
