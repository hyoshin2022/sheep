export class Sheep {
    constructor(img, stageWidth) {
        this.img = img;

        //frame 정의
        this.totalFrame = 8;
        this.curFrame = 0; //현재프레임

        this.imgWidth = 360;
        this.imgHeight = 300;

        this.sheepWidth = 180;
        this.sheepHeight = 150;

        this.sheepWidthHalf = this.sheepWidth / 2;
        this.x = stageWidth + this.sheepWidth;
        this.y = 0;
        this.speed = Math.random() * 2 + 1;

        this.fps = 24; //그림 그릴때 사용했던 fps
        this.fpsTime = 1000 / this.fps;
    }

    draw(ctx, t, dots) {

        if (!this.time) { //timestamp를 시간으로 정의
            this.time = t;
        }

        const now = t - this.time;
        if (now > this.fpsTime) {
            this.time = t;
            this.curFrame += 1;
            if (this.curFrame == this.totalFrame) { //리셋정의
                this.curFrame = 0;
            }
        }

        this.animate(ctx, dots);
    }

    animate(ctx, dots) {
        this.x -= this.speed;
        // this.x = 650;
        //this.y = 550;
        const closest = this. getY(this.x, dots);
        this.y = closest.y;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(closest.rotation);
        //ctx.fillStyle = '#000000';
        // ctx.fillRect(
        //     -this.sheepWidthHalf,
        //     -this.sheepHeight + 20,
        //     this.sheepWidth,
        //     this.sheepHeight,
        // );
        ctx.drawImage(
            this.img,
            this.imgWidth * this.curFrame,
            0,
            this.imgWidth,
            this.imgHeight,
            -this.sheepWidthHalf,
            -this.sheepHeight + 25,
            this.sheepWidth,
            this.sheepHeight,
        );
        ctx.restore();
    }

    getY(x, dots) {
        for (let i = 1; i < dots.length; i++){
            if (x >= dots[i].x1 && x <= dots[i].x3) {
                return this.getY2(x, dots[i]);
            }
        }

        return {
            y: 0,
            rotataion: 0
        };
    }
                                    // 동영상 10:24분부터 시청 https://www.youtube.com/watch?v=hCHL7sydzn0
    getY2(x, dot) { //곡선의 비율 p를 200개의 촘촘한 비율로 나눠서 x값과 가장 근사한 좌표값을 리턴
        const total = 200;
        let pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, 0);
        let prevX = pt.x;
        for (let i = 1; i < total; i++) {
            const t = i / total;
            pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, t);

            if (x>= prevX && x <= pt.x) {
                return pt;
            }
            prevX = pt.x;
        }
        return pt;
    }

    getQuadValue(p0, p1, p2, t) { //곡선 구하는 공식
        return (1 - t) * (1 - t ) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }

    getPointOnQuad(x1, y1, x2, y2, x3, y3, t) {
        const tx = this.quadTangent(x1, x2, x3, t);
        const ty = this.quadTangent(y1, y2, y3, t);
        const rotation = -Math.atan2(tx, ty) + (90 * Math.PI / 180); //각도구하는 공식 atan2 수직구하는공식을 수평으로 변환하려면 90도를 더해줘야함(90도(dgree)를 radian으로 변환해주는 식)
        return {
            x: this.getQuadValue(x1, x2, x3, t),
            y: this.getQuadValue(y1, y2, y3, t),
            rotation: rotation,
        }
    }

    quadTangent(a, b, c, t) { //기울기 구하는 공식
        return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
    }
}