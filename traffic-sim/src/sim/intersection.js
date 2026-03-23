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

        if (this.phase === "NS_GREEN" && this.t >= ns) {
            this.phase = "YELLOW_TO_EW";
            this.t = 0;
        } else if (this.phase === "YELLOW_TO_EW" && this.t >= y) {
            this.phase = "ALL_RED_TO_EW";
            this.t = 0;
        } else if (this.phase === "ALL_RED_TO_EW" && this.t >= ar) {
            this.phase = "EW_GREEN";
            this.t = 0;
        } else if (this.phase=== "EW_GREEN" && this.t >= ew) {
            this.phase = "YELLOW_TO_NS";
            this.t = 0;
        } else if (this.phase === "YELLOW_TO_NS" && this.t >= y) {
            this.phase = "ALL_RED_TO_NS";
            this.t = 0;
        } else if (this.phase === "ALL_RED_TO_NS" && this.t >= ar) {
            this.phase = "NS_GREEN";
            this.t = 0;
        }
    }

    isGreenNS() {
        return this.phase === "NS_GREEN";
    }

    isGreenEW() {
        return this.phase === "EW_GREEN";
    }

    remaining() {
        const c = this.cfg;
        const ns = c.nsGreen, ew = c.ewGreen, y = c.yellow, ar = c.allRed;

        if (this.phase === "NS_GREEN") {
            return Math.max(0, ns - this.t);
        }
        if (this.phase === "EW_GREEN") {
            return Math.max(0, ew - this.t);
        }
        if (this.phase.startsWith("YELLOW")) {
            return Math.max(0, y - this.t);
        }
        return Math.max(0, ar - this.t);
    }
}

export class Intersection {
    constructor(cfg) {
        this.queues = { N: [], E: [], S: [], W: [] };
        this.signal = new SignalController(cfg.signal);
        this.headway = cfg.flow.headway;

        // discharge accumulators so we can do "1 car every headway seconds"
        this.dischargeAcc = { N: 0, E: 0, S: 0, W: 0 };
    }

    step(dt) {
        this.signal.step(dt);

        // reset accumulators for approaches that are red (so discharge doesn't "store up")
        const greenNs = this.signal.isGreenNS();
        const greenEW = this.signal.isGreenEW();

        for (const dir of ["N", "S"]) {
            if (!greenNs) {
                this.dischargeAcc[dir] = 0;
            }
        }
        for (const dir of ["E", "W"]) {
            if (!greenEW) {
                this.dischargeAcc[dir] = 0;
            }
        }

        // add dt to accumulators for green approaches
        if (greenNs) {
            this.dischargeAcc.N += dt;
            this.dischargeAcc.S += dt;
        }
        if (greenEW) {
            this.dischargeAcc.E += dt;
            this.dischargeAcc.W += dt;
        }
    }

    tryServe(timeNow) {
        // Serve cars if accumulator >= headway
        const served = [];

        const attempt = (dir) => {
            while (this.dischargeAcc[dir] >= this.headway && this.queues[dir].length >0) {
                this.dischargeAcc[dir] -= this.headway;
                const car = this.queues[dir].shift();
                car.servedTime = timeNow;
                served.push(car);
            }
        };

        // order doesn't matter for now
        for (const dir of ["N", "S", "E", "W"]) {
            attempt(dir);
            return served;
        }
    }
}