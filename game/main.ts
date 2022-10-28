class MoveableObject {
    positionX: number;
    positionY: number;
    directionX: number;
    directionY: number;
    width: number;
    height: number;

    constructor(posX: number, posY: number, dirX: number, dirY: number, wid: number, hei: number) {
        this.positionX = posX;
        this.positionY = posY;
        this.directionX = dirX;
        this.directionY = dirY;
        this.width = wid;
        this.height = hei;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    }

    move(speed: number) {
        this.positionX += this.directionX * speed;
        this.positionY += this.directionY * speed;
    }

    doesOverlapWith(obj: MoveableObject)
    {
        if (this.positionX > obj.positionX + obj.width || obj.positionX > this.positionX + this.width)
            return false;
        if (this.positionY + this.height < obj.positionY || obj.positionY + obj.height < this.positionY)
            return false;
        return true;
    }
}



class Ball extends MoveableObject {
    speed: number;

    constructor(fieldWidth: number, fieldHeight: number, speed: number)
    {
        super(0, 0, 0, 0, 20, 20);
        this.speed = speed;
        this.reset(fieldWidth, fieldHeight);
    }
    
    reset(fieldWidth: number, fieldHeight: number) {
        this.positionX = fieldWidth / 2 - this.width / 2;
        this.positionY = fieldHeight / 2 - this.height / 2;
        this.directionX = Math.random() < 0.5 ? 1 : -1;
        this.directionY = Math.floor(Math.random() * 5) - 2;
    }

    hitWall(fieldHeight: number) {
        if (this.positionY < 0 || this.positionY + this.height > fieldHeight)
            this.directionY = -this.directionY;
    }

    hitBat(bat: Bat) {
        if (this.doesOverlapWith(bat))
        {
            const new_dir = [-3, -2, -1, 0, 1, 2, 3];
            if (this.directionX < 0)
            {
                if (this.positionX == bat.positionX + bat.width)
                {
                    this.directionY = Math.floor((this.positionY + this.height / 2 - bat.positionY) / (bat.height / 5)) - 2;
                    this.directionX = -this.directionX;
                    return ;
                }

            }
            else
            {
                if (this.positionX + this.width == bat.positionX)
                {
                    this.directionY = Math.floor((this.positionY + this.height / 2 - bat.positionY) / (bat.height / 5)) - 2;
                    this.directionX = -this.directionX;
                    return ;
                }
            }
            this.directionY = -this.directionY;
        }
    }

    hitPowerUp(powerUp: PowerUp, bat: Bat, fieldWitdh: number, fieldHeight: number) {
        if (this.doesOverlapWith(powerUp) && powerUp._timeInactive == 0)
        {
            bat.startPowerUp(fieldHeight);
            powerUp.reset(fieldWitdh, fieldHeight);
        }
    }

    animate(fieldWidth: number, fieldHeight: number, ctx: CanvasRenderingContext2D, batP1: Bat, batP2: Bat, powerUp: PowerUp) {
        this.hitWall(fieldHeight);
        if (this.directionX < 0)
        {
            this.hitPowerUp(powerUp, batP2, fieldWidth, fieldHeight);
            this.hitBat(batP1)
        }
        else if (this.directionX > 0)
        {
            this.hitPowerUp(powerUp, batP1, fieldWidth, fieldHeight);
            this.hitBat(batP2)
        }
        this.move(this.speed);
        this.draw(ctx);
    }
}

class Bat extends MoveableObject {
    normalBadHeight: number;
    powerUpBadHeight: number;
    powerUpActive: boolean;
    powerUpTimer: number;

    constructor(posX: number, fieldHeight: number, badHeight: number, powerUpBadHeight: number) {
        super(posX, fieldHeight / 2 - badHeight / 2, 0, 1, 10, badHeight);
        this.powerUpTimer = 0;
        this.powerUpActive = false;
        this.normalBadHeight = badHeight;
        this.powerUpBadHeight = powerUpBadHeight;
    }

    animate(ctx: CanvasRenderingContext2D) {
        this.checkPowerUpTimer();
        this.draw(ctx)
    }

    reset() {
        this.height = this.normalBadHeight;
        this.powerUpActive = false;
        this.positionY = this.positionY + ((this.powerUpBadHeight - this.normalBadHeight) / 2);
    }

    checkPowerUpTimer() {
        if (this.powerUpActive)
        {
            if (this.powerUpTimer > 0)
                this,this.powerUpTimer -= 1;
            else
                this.reset();
        }
    }

    startPowerUp(fieldHeight: number) {
        this.powerUpTimer = 600;
        this.powerUpActive = true;
        var newSize = 200;
        if (this.positionY < (this.powerUpBadHeight - this.normalBadHeight) / 2)
            this.positionY = 0;
        else if (this.positionY + this.height > fieldHeight - (this.powerUpBadHeight - this.normalBadHeight) / 2)
            this.positionY = fieldHeight - this.powerUpBadHeight;
        else
        this.positionY -= (this.powerUpBadHeight - this.normalBadHeight) / 2;
        this.height = this.powerUpBadHeight;
    }
}

class PowerUp extends MoveableObject {
    _timeInactive: number;
    _restartTime: number;

    constructor(fieldWidth: number, fieldHeight: number, restartTime: number) {
        super(0, 0, 0, 0, 10, 10);
        this.setPosistion(fieldWidth, fieldHeight);
        this._restartTime = restartTime;
        this._timeInactive = this._restartTime / 2;
    }

    setPosistion(fieldWidth: number, fieldHeight: number) {
        var posY = Math.floor(Math.random() * fieldHeight - this.height);
        var posX = Math.floor(Math.random() * fieldWidth / 3 * 2 + 1 / 6 * fieldWidth);
        this.positionX = posX;
        this.positionY = posY;
    }

    reset(fieldWidth: number, fieldHeight: number) {
        this.setPosistion(fieldWidth, fieldHeight);
        this._timeInactive = this._restartTime;
    }

    animate(ctx: CanvasRenderingContext2D) {
        if (this._timeInactive > 0)
            this._timeInactive -= 1;
        else
            this.draw(ctx);
    }
}

class GameState {
    scoreP1: number;
    scoreP2: number;
    batP1: Bat;
    batP2: Bat;
    powerUp: PowerUp;
    ball: Ball;
    frame: number;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;

    constructor(canvas: HTMLCanvasElement) {
        this.scoreP1 = 0;
        this.scoreP2 = 0;
        this.batP1 = new Bat(10, 160, 160, 200);
        this.batP2 = new Bat(canvas.width - 20, canvas.height, 160, 200);
        this.ball = new Ball(canvas.width, canvas.height, 2);
        this.powerUp = new PowerUp(canvas.width, canvas.height, 600);
        this.ctx = canvas.getContext("2d")!;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    score() {
        if (this.ball.positionX + this.ball.width < 0)
        {
            this.scoreP2 += 1;
            this.ball.reset(this.width, this.height);
            console.log("P2 Scored\nP1 " + this.scoreP1 + " - " + this.scoreP2 + " P2\n\n");
        }
        else if (this.ball.positionX > this.width){
            this.scoreP1 += 1;
            this.ball.reset(this.width, this.height);
            console.log("P1 Scored\nP1 " + this.scoreP1 + " - " + this.scoreP2 + " P2\n\n");
        }
    }

    animation() {
        this.ctx.clearRect(0,0,this.width, this.height);
        this.powerUp.animate(this.ctx);
        this.batP1.animate(this.ctx);
        this.batP2.animate(this.ctx);
        this.ball.animate(this.width, this.height, this.ctx, this.batP1, this.batP2, this.powerUp);

    }
}

function step(canvas: HTMLCanvasElement) {
    const gameState = new GameState(canvas);

    const startAnimation = () => {
        gameState.animation()
        gameState.score();
        gameState.frame += 1;
        requestAnimationFrame(startAnimation);
    }
    startAnimation();
}

function test() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    step(canvas)
}
