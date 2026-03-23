// Simple seeded rnG (Mulberry32). Good enough for simulation repeatability.
export function makeRng(seed) {
    let t = seed >>> 0;
    return function rand() {
        t += 0x6D2B79F5;
        let x = t;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}