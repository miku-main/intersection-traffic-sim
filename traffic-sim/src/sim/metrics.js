export class Metrics {
    constructor() {
        this.spawned = 0;
        this.served = 0;
        this.totalDelay = 0; // sum(servedTime - spawnTime)
    }
    
    onSpawn() {
        this.spawned += 1;
    }

    onServe(car, servedTime) {
        this.served += 1;
        this.totalDelay += (servedTime - car.spawnTime);
    }

    snapshot(queues = null) {
        const avgDelay = this.served > 0 ? this.totalDelay / this.served : 0;
        return {
            spawned: this.spawned,
            served: this.served,
            avgDelay,
            qN: queues ? queues.N.length : 0,
            qE: queues ? queues.E.length : 0,
            qS: queues ? queues.S.length : 0,
            qW: queues ? queues.W.length : 0
        };
    }
}