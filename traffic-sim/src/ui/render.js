export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    draw(sim) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // world layout
        const cx = w * 0.45;
        const cy = h * 0.5;
        const roadW = 120;
        const roadL = 520;

        // roads
        ctx.fillStyle = "#1b1f28";
        // vertical road
        ctx.fillRect(cx - roadW/2, cy - roadL/2, roadW, roadL);
        // horizontal road
        ctx.fillRect(cx - roadL/2, cy - roadW/2, roadL, roadW);

        // intersection box
        ctx.fillStyle = "#141824";
        ctx.fillRect(cx - roadW/2, cy - roadW/2, roadW, roadW);

        // lane center lines
        ctx.strokeStyle = "#2a3140";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - roadL/2);
        ctx.lineTo(cx, cy + roadL/2);
        ctx.moveTo(cx - roadL/2, cy);
        ctx.lineTo(cx + roadL/2, cy);
        ctx.stroke();

        // stop lines
        ctx.strokeStyle = "#cfd3dc";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - roadW/2, cy - roadW/2);
        ctx.lineTo(cx + roadW/2, cy - roadW/2);
        ctx.moveTo(cx - roadW/2, cy + roadW/2);
        ctx.lineTo(cx + roadW/2, cy + roadW/2);
        ctx.moveTo(cx - roadW/2, cy - roadW/2);
        ctx.lineTo(cx - roadW/2, cy + roadW/2);
        ctx.moveTo(cx + roadW/2, cy - roadW/2);
        ctx.lineTo(cx + roadW/2, cy + roadW/2);
        ctx.stroke();

        // lights
        this.drawLights(ctx, sim.intersection.signal, cx, cy, roadW);

        // cars (queued)
        this.drawQueues(ctx, sim.intersection.queues, cx, cy, roadW);

        // HUD
        ctx.fillStyle = "#eaeaea";
        ctx.font = "14px system-ui";
        ctx.fillText(`t=${sim.time.toFixed(1)}s`, 14, 22);
    }

    drawLights(ctx, signal, cx, cy, roadW) {
        const nsGreen = signal.isGreenNS();
        const ewGreen = signal.isGreenEW();
    
        // positions for light indicators
        const r = 8;
        const pad = 18;
    
        // NS light (top-right of intersection)
        this.drawLight(ctx, cx + roadW/2 + pad, cy - roadW/2 - pad, nsGreen ? "G" : (ewGreen ? "R" : "Y"), r);
    
        // EW light (bottom-left of intersection)
        this.drawLight(ctx, cx - roadW/2 - pad, cy + roadW/2 + pad, ewGreen ? "G" : (nsGreen ? "R" : "Y"), r);
    }
    
    drawLight(ctx, x, y, state, r) {
        // state: G/R/Y
        let color = "#666";
        if (state === "G") {
            color = "#44d07b";
        }
        if (state === "R") {
            color = "#ff4d4d";
        }
        if (state === "Y") {
            color = "#ffd24d";
        }

        ctx.fillStyle = "#0b0d11";
        ctx.beginPath();
        ctx.arc(x, y, r + 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    drawQueues(ctx, queues, cx, cy, roadW) {
        const carW = 16;
        const carL  = 26;
        const gap = 6;
        const maxDraw = 18;

        //Each approach: stack cars away from stop line
        const drawStack = (dir, baseX, baseY, dx, dy, rotate) => {
            const q = queues[dir];
            const n = Math.min(q.length, maxDraw);

            for (let i = 0; i < n; i++) {
                const x = baseX + dx * i * (carL + gap);
                const y = baseY + dy * i * (carL + gap);

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotate);
                ctx.fillStyle = "#69a7ff";
                ctx.fillRect(-carW/2, -carL/2, carW, carL);
                ctx.restore();
            }

            // if too many cars, show "+X"
            if (q.length > maxDraw) {
                ctx.fillStyle = "#cfd3dc";
                ctx.font = "12px system-ui";
                ctx.fillText(`+${q.length - maxDraw}`, baseX + dx * (maxDraw+1) * (carL+gap), baseY + dy * (maxDraw+1) * (carL+gap));
            }
        };

        // stop line anchor points (just before intersection)
        drawStack("N", cx - roadW*0.20, cy - roadW/2 - 18, 0, -1, 0);              // coming from North, stacked upward
        drawStack("S", cx + roadW*0.20, cy + roadW/2 + 18, 0, +1, Math.PI);        // from South, stacked downward
        drawStack("E", cx + roadW/2 + 18, cy - roadW*0.20, +1, 0, Math.PI/2);      // from East, stacked right
        drawStack("W", cx - roadW/2 - 18, cy + roadW*0.20, -1, 0, -Math.PI/2);     // from West, stacked left
    }
}