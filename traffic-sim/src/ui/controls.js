import { makeDefaultConfig } from "../sim/types.js";

function num(id) {
    return Number(document.getElementById(id).value);
}

export function bindControls({ onStart, onPause, onReset, onApply }) {
    document.getElementById("btnStart").addEventListener("click", onStart);
    document.getElementById("btnPause").addEventListener("click", onPause);
    document.getElementById("btnReset").addEventListener("click", onReset);

    document.getElementById("btnApply").addEventListener("click", () => {
        const cfg = makeDefaultConfig();

        cfg.signal.nsGreen = num("nsGreen");
        cfg.signal.ewGreen = num("ewGreen");
        cfg.signal.yellow  = num("yellow");
        cfg.signal.allRed  = num("allRed");

        cfg.arrivals.N = num("arrN");
        cfg.arrivals.E = num("arrE");
        cfg.arrivals.S = num("arrS");
        cfg.arrivals.W = num("arrW");

        cfg.flow.headway = num("headway");
        cfg.sim.seed = Math.floor(num("seed"));

        onApply(cfg);
    });
}