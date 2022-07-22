interface meta {
    name: string;
    aliases?: string[];
    catagory?: string | "info";
    description: string;
    usage: string;
    hidden?: boolean;
}
export interface CommandType {
    default: any;
    meta:meta
}
