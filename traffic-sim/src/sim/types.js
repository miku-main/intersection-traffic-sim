export function makeDefaultConfig() {
    return {
        sim: {
            dt: 0.1, // seconds per tick
            seed: 12345
        },
        arrivals: {
            // cars per minute
            N: 10,
            E: 28,
            S: 10,
            W: 18
        },
        signal: {
            nsGreen: 20,
            ewGreen: 20,
            yellow: 2,
            allRed: 1
        },
        flow: {
            headway: 2.0 // seconds per car during green
        }
    };
}