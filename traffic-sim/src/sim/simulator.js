import { Intersection } from "./intersection";
import { Metrics } from "./metrics";
import { makeRng } from "./rng";

export class Simulator {
    constructor(cfg) {
        this.cfg = cfg;
        this.time = 0;
        this.nextId = 1;

        this.rng = makeRng(cfg.sim.seed);
        this.intersection = new Intersection(cfg);
        this.metrics = new Metrics();
    }

    // convert cars/min to probability per tick
    arrivalProbPerTick(carsPerMin) {
        const carsPerSec = carsPerMin / 60;
        return carsPerSec * this.cfg.sim.dt; // p = lambda * dt
    }

    maybeSpawn(dir) {
        const p = this.arrivalProbPerTick(this.cfg.arrivals[dir]);
        if (this.rng() < p) {
            const car = {
                id: this.nextId++,
                dir,
                spawnTime: this.time,
                servedTime: null
            };
            this.intersection.queues[dir].push(car);
            this.metrics.onSpawn();
        }
    }

    step(dt) {
        // we use cfg.sim.dt as fixed step; dt param exists for clarity
        this.time += dt;

        // spawns
        this.maybeSpawn("N");
        this.maybeSpawn("E");
        this.maybeSpawn("S");
        this.maybeSpawn("W");

        // intersection state update
        this.intersection.step(dt);

        // serve cars if green allows discharge
        const servedCars = this.intersection.tryServe(this.time);
        for (const car of servedCars) {
            this.metrics.onServe(car, this.time);
        }
    }
}