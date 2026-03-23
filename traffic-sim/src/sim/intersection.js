export class SignalController {
    constructor(cfg) {
        this.cfg = cfg;
        this.phase = "NS_GREEN";
        this.t = 0;
    }

    step(dt) {
        this.t += dt;

        const c = this.cfg;
        // Phase duration
        const ns = c.nsGreen;
        const ew = c.ewGreen;
        const y = c.yellow;
        const ar = c.allRed;

        // State machine sequence:
        // NS_GREEN -> YELLOW -> ALL_RED -> EW_GREEN -> YELLOW -> ALL_RED -> ...
        // We reuse YELLOW/ALL_RED but interpret which direction is next by phase order.
    }
}