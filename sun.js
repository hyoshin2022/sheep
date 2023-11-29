export class Sun {
    constructor() {
        this.radius = 200;

        this.total = 60;
        this.gap = 1 / this.total; // 1/60
        this.originPos = [];
        this.pos = [];
        for (let i = 0; i <this.total; i++) {
            const pos = this.getCirclePoint(this.radius, this.gap * i);
            this.originPos[i] = pos;
            this.pos[i] = pos;
        }

        this.fps = 30; //fps 정의
        this.fpsTime = 1000 / this.fps;
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.x = this.stageWidth - this.radius - 140;
        this.y = this.radius + 100;
    }

    draw(ctx, t) {
        if (!this.time) {
            this.time = t;
        }
        const now = t - this.time;
        if (now > this.fpsTime) {
            this.time = t;
            this.updatePoints();
        }

        ctx.fillStyle = '#ffb200'; //노란색
        ctx.beginPath(); //생성
        // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        // ctx.fill();
        // 원그리는 대신 생성된 좌표를 연결해줌(지글지글 타는 모양)
        let pos = this.pos[0];
        ctx.moveTo(pos.x + this.x, pos.y + this.y);
        for (let i = 1; i < this.total; i++) {
            const pos = this.pos[i];
            ctx.lineTo(pos.x + this.x, pos.y + this.y);
        }
        ctx.fill();
    }

    updatePoints() {
        for (let i = 1; i < this.total; i++) {
            const pos = this.originPos[i];
            this.pos[i] = {
                x: pos.x + this.ranInt(5),
                y: pos.y + this.ranInt(5)
            }
        }
    }

    ranInt(max) {
        return Math.random() * max;
    }

    getCirclePoint(radius, t) { //원 위 좌표 구하는 함수(지름의 비율에서 사인과 코사인 함수를 사용 + 반지름 -> 좌표)
        const theta = Math.PI * 2 * t;
        
        return { //고정된 좌표
            x: (Math.cos(theta) * radius),
            y: (Math.sin(theta) * radius)
        };
    }

}