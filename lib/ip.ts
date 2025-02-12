import { IPinfo, IPinfoWrapper, LruCache, Options } from "node-ipinfo";
declare global {
    var ipinfoWrapper: IPinfoWrapper | undefined;
}
export const ipinfoWrapper = globalThis.ipinfoWrapper || new IPinfoWrapper(
    process.env.IP_ACCESS_TOKEN || "",
    new LruCache({
        max: 5000,
        ttl: 24 * 1000 * 60 * 60,
    })
);
