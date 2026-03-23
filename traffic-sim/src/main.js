import { Simulator } from "./sim/simulator";
import { makeDefaultConfig } from "./sim/types";
import { bindControls } from "./ui/controls";
import { Renderer } from "./ui/render";

const canvas = document.getElementById("simCanvas");
const statusText = document.getElementById("statusText");

let config = makeDefaultConfig();
let sim = new Simulator(config);
let renderer = new Renderer(canvas);

let running  = false;
let lastTs = null;

function setStatus() {
    const m = sim.metrics.snapshot();
    statusText.textContent = 
    `time: ${sim.time.toFixed(1)}s
    phase: ${sim.intersection.signal.phase}
    phaseRemaining: ${sim.intersection.signal.remaining().toFixed(1)}s
    
    spawned: ${m.spawned}
    served: ${m.served}
    
    avgDelay: ${m.avgDelay.toFixed(2)}s
    queues: N=${m.qN} E=${m.qE}, S=${m.qS} W=${m.qW}`;
}

function frame(ts) {
    if (!lastTs) {
        lastTs = ts;
    }
    const dtReal = (ts - lastTs) / 1000;
    lastTs = ts;

    if (running) {
        // step sim in fixed dt chunks for stability
        const fixedDt = config.sim.dt;
        let accumulator = dtReal;

        // clamp so tab switching doesn't explode the sim
        accumulator = Math.min(accumulator, 0.2);

        while (accumulator > 0) {
            sim.step(fixedDt);
            accumulator -= fixedDt;
        }
    }

    renderer.draw(sim);
    setStatus();
    requestAnimationFrame(frame);
}

bindControls({
    onStart: () => { running = true; },
    onPause: () => { running = false; },
    onReset: () => {
        running = false;
        sim = new Simulator(config);
        lastTs = null;
    },
    onApply: (newConfig) => {
        // apply new settings and restart the sim cleanly
        config = newConfig;
        running = false;
        sim = new Simulator(config);
        lastTs = null;
    }
});

requestAnimationFrame(frame);