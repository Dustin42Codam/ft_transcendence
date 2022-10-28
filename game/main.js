var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MoveableObject = /** @class */ (function () {
    function MoveableObject(posX, posY, dirX, dirY, wid, hei) {
        this.positionX = posX;
        this.positionY = posY;
        this.directionX = dirX;
        this.directionY = dirY;
        this.width = wid;
        this.height = hei;
    }
    MoveableObject.prototype.draw = function (ctx) {
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    };
    MoveableObject.prototype.move = function (speed) {
        this.positionX += this.directionX * speed;
        this.positionY += this.directionY * speed;
    };
    MoveableObject.prototype.doesOverlapWith = function (obj) {
        if (this.positionX > obj.positionX + obj.width || obj.positionX > this.positionX + this.width)
            return false;
        if (this.positionY + this.height < obj.positionY || obj.positionY + obj.height < this.positionY)
            return false;
        return true;
    };
    return MoveableObject;
}());
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(fieldWidth, fieldHeight, speed) {
        var _this = _super.call(this, 0, 0, 0, 0, 20, 20) || this;
        _this.speed = speed;
        _this.reset(fieldWidth, fieldHeight);
        return _this;
    }
    Ball.prototype.reset = function (fieldWidth, fieldHeight) {
        this.positionX = fieldWidth / 2 - this.width / 2;
        this.positionY = fieldHeight / 2 - this.height / 2;
        this.directionX = Math.random() < 0.5 ? 1 : -1;
        this.directionY = Math.floor(Math.random() * 5) - 2;
    };
    Ball.prototype.hitWall = function (fieldHeight) {
        if (this.positionY < 0 || this.positionY + this.height > fieldHeight)
            this.directionY = -this.directionY;
    };
    Ball.prototype.hitBat = function (bat) {
        if (this.doesOverlapWith(bat)) {
            var new_dir = [-3, -2, -1, 0, 1, 2, 3];
            if (this.directionX < 0) {
                if (this.positionX == bat.positionX + bat.width) {
                    this.directionY = Math.floor((this.positionY + this.height / 2 - bat.positionY) / (bat.height / 5)) - 2;
                    this.directionX = -this.directionX;
                    return;
                }
            }
            else {
                if (this.positionX + this.width == bat.positionX) {
                    this.directionY = Math.floor((this.positionY + this.height / 2 - bat.positionY) / (bat.height / 5)) - 2;
                    this.directionX = -this.directionX;
                    return;
                }
            }
            this.directionY = -this.directionY;
        }
    };
    Ball.prototype.hitPowerUp = function (powerUp, bat, fieldWitdh, fieldHeight) {
        if (this.doesOverlapWith(powerUp) && powerUp._timeInactive == 0) {
            bat.startPowerUp(fieldHeight);
            powerUp.reset(fieldWitdh, fieldHeight);
        }
    };
    Ball.prototype.animate = function (fieldWidth, fieldHeight, ctx, batP1, batP2, powerUp) {
        this.hitWall(fieldHeight);
        if (this.directionX < 0) {
            this.hitPowerUp(powerUp, batP2, fieldWidth, fieldHeight);
            this.hitBat(batP1);
        }
        else if (this.directionX > 0) {
            this.hitPowerUp(powerUp, batP1, fieldWidth, fieldHeight);
            this.hitBat(batP2);
        }
        this.move(this.speed);
        this.draw(ctx);
    };
    return Ball;
}(MoveableObject));
var Bat = /** @class */ (function (_super) {
    __extends(Bat, _super);
    function Bat(posX, fieldHeight, badHeight, powerUpBadHeight) {
        var _this = _super.call(this, posX, fieldHeight / 2 - badHeight / 2, 0, 1, 10, badHeight) || this;
        _this.powerUpTimer = 0;
        _this.powerUpActive = false;
        _this.normalBadHeight = badHeight;
        _this.powerUpBadHeight = powerUpBadHeight;
        return _this;
    }
    Bat.prototype.animate = function (ctx) {
        this.checkPowerUpTimer();
        this.draw(ctx);
    };
    Bat.prototype.reset = function () {
        this.height = this.normalBadHeight;
        this.powerUpActive = false;
        this.positionY = this.positionY + ((this.powerUpBadHeight - this.normalBadHeight) / 2);
    };
    Bat.prototype.checkPowerUpTimer = function () {
        if (this.powerUpActive) {
            if (this.powerUpTimer > 0)
                this, this.powerUpTimer -= 1;
            else
                this.reset();
        }
    };
    Bat.prototype.startPowerUp = function (fieldHeight) {
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
    };
    return Bat;
}(MoveableObject));
var PowerUp = /** @class */ (function (_super) {
    __extends(PowerUp, _super);
    function PowerUp(fieldWidth, fieldHeight, restartTime) {
        var _this = _super.call(this, 0, 0, 0, 0, 10, 10) || this;
        _this.setPosistion(fieldWidth, fieldHeight);
        _this._restartTime = restartTime;
        _this._timeInactive = _this._restartTime / 2;
        return _this;
    }
    PowerUp.prototype.setPosistion = function (fieldWidth, fieldHeight) {
        var posY = Math.floor(Math.random() * fieldHeight - this.height);
        var posX = Math.floor(Math.random() * fieldWidth / 3 * 2 + 1 / 6 * fieldWidth);
        this.positionX = posX;
        this.positionY = posY;
    };
    PowerUp.prototype.reset = function (fieldWidth, fieldHeight) {
        this.setPosistion(fieldWidth, fieldHeight);
        this._timeInactive = this._restartTime;
    };
    PowerUp.prototype.animate = function (ctx) {
        if (this._timeInactive > 0)
            this._timeInactive -= 1;
        else
            this.draw(ctx);
    };
    return PowerUp;
}(MoveableObject));
var GameState = /** @class */ (function () {
    function GameState(canvas) {
        this.scoreP1 = 0;
        this.scoreP2 = 0;
        this.batP1 = new Bat(10, 160, 160, 200);
        this.batP2 = new Bat(canvas.width - 20, canvas.height, 160, 200);
        this.ball = new Ball(canvas.width, canvas.height, 2);
        this.powerUp = new PowerUp(canvas.width, canvas.height, 600);
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
    }
    GameState.prototype.score = function () {
        if (this.ball.positionX + this.ball.width < 0) {
            this.scoreP2 += 1;
            this.ball.reset(this.width, this.height);
            console.log("P2 Scored\nP1 " + this.scoreP1 + " - " + this.scoreP2 + " P2\n\n");
        }
        else if (this.ball.positionX > this.width) {
            this.scoreP1 += 1;
            this.ball.reset(this.width, this.height);
            console.log("P1 Scored\nP1 " + this.scoreP1 + " - " + this.scoreP2 + " P2\n\n");
        }
    };
    GameState.prototype.animation = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.powerUp.animate(this.ctx);
        this.batP1.animate(this.ctx);
        this.batP2.animate(this.ctx);
        this.ball.animate(this.width, this.height, this.ctx, this.batP1, this.batP2, this.powerUp);
    };
    return GameState;
}());
function step(canvas) {
    var gameState = new GameState(canvas);
    var startAnimation = function () {
        gameState.animation();
        gameState.score();
        gameState.frame += 1;
        requestAnimationFrame(startAnimation);
    };
    startAnimation();
}
function test() {
    var canvas = document.getElementById("canvas");
    step(canvas);
}
