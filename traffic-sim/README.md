# Traffic Intersection Simulator (JS + Canvas)

## Progress 1 - Skeleton + Spawning Queues

### What worked
- A canvas based view of a 4-way intersection.
- Cars spawn into approach queues (N/E/S/W) using probabilistic arrivals.
- Basic controls: start, pause, reset, apply settings.
- Status panel shows current time and queue sizes.

# Model
**Time model**
- Discrete time steps `dt` (default: 0.1s per tick).

**Arrivals**
- Each approach has a rate in cars/min.
- Converted into per-tick probability:
    - `p = (carsPerMin / 60) * dt`
- On each tick, we roll a seeded random number and spawn a car if ` rand < p`.

**Queues**
- Each approach is a FIFO queue:
    - `queues.N`, `queues.E`, `queues.S`, `queues.W`
- Cars do not move yet (movement starts later with signals).

### File map
- `src/main.js`: main loop + start/pause/reset + connects UI to simulation.
- `src/sim/types.js`: default config values (dt, seed, arrivals).
- `src/sim/rng.js`: seeded RNG so results are repeatable.
- `src/sim/simulator.js`: spawns cars into queues every tick.
- `src/ui/render.js`: draws intersection + queued cars on the canvas.
- `src/ui/controls.js`: reads inputs, handles buttons, produces a new config.

### Next
- Add a traffic signal state machine (NS green / EW green + yellow/all-red).
- Add a simple dishcarge rule (1 car every X seconds during green).