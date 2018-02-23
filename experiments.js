/*
 * @author: semyon (github.com/semyon-san)
 * @name: Canvas animation using Factory Functions
 *
 */

var canvas = document.querySelector('canvas');

canvas.width = document.querySelector('body').offsetWidth;
canvas.height = document.querySelector('body').offsetHeight;

var c = canvas.getContext('2d');

const Coordinates = function(coordX, coordY) {
    let x = (coordX !== undefined) ? coordX : 0;
    let y = (coordY !== undefined) ? coordY : 0;

    return Object.assign(
        {
            x: function(newX) {
                return (newX === undefined) ? x : (x = newX);
            },
            y: function(newY) {
                return (newY === undefined) ? y : (y = newY);
            },
            incX: function(value) {
                return (x += value);
            },
            incY: function(value) {
                return (y += value);
            }
        }
    );
}

const Velocity = function(velocityX, velocityY) {
    let dx = (velocityX !== undefined) ? velocityX : 1;
    let dy = (velocityY !== undefined) ? velocityY : 1;
    return Object.assign(
        {
            reverse: function() {
                dx = -dx;
                dy = -dy;
            },
            reverseX: function() {
                dx = -dx;
            },
            reverseY: function() {
                dy = -dy;
            },
            dx: function(newDx) {
                return (newDx === undefined) ? dx : (dx = newDx);
            },
            dy: function(newDy) {
                return (newDy === undefined) ? dy : (dy = newDy);
            }
        }
    );
}

const Entity = function() {
    return Object.assign(
        {
            draw: function() {
                this._draw();
            },
            changePos: function() {
                this.incX(this.dx());
                this.incY(this.dy());
            },
            collides: function(entity) {
                let collidesX = (this.xend() >= entity.xstart()) && (this.xstart() <= entity.xend());
                let collidesY = (this.yend() >= entity.ystart()) && (this.ystart() <= entity.yend());

                return collidesX && collidesY;
            },
            checkWallCollision: function() {
                if (this.xend() >= canvas.width || this.xstart() <= 0)
                    this.reverseX();
                if (this.yend() >= canvas.height || this.ystart() <= 0)
                    this.reverseY();
            },
            bounce: function(object) {
                this.reverse();
            },
            setLogger: function(logger) {
                this.logger = logger;
            },
            xstart: function() {
                return this._xstart();
            },
            xend: function() {
                return this._xend();
            },
            ystart: function() {
                return this._ystart();
            },
            yend: function() {
                return this._yend();
            }
        },
        Coordinates(),
        Velocity(10, 10)
    );
}

const Rectangle = function(rectWidth=100, rectHeight=100, position) {
    let width = rectWidth;
    let height = rectHeight;

    let self = Object.assign(
        {
            _draw: function() {
                c.fillRect(this.x(), this.y(), width, height);
            },
            _xstart: function() {
                return this.x();
            },
            _xend: function() {
                return this.x() + width;
            },
            _ystart: function() {
                return this.y();
            },
            _yend: function() {
                return this.y() + height;
            },
            width: function(newWidth) {
                return (newWidth === undefined) ? width : (width = newWidth);
            },
            height: function(newHeight) {
                return (newHeight === undefined) ? height : (height = newHeight);
            }
        },
        Entity()
    );

    self.x(position.x());
    self.y(position.y());

    return self;
}

const Circle = function(circleRadius, position) {
    let radius = (circleRadius !== undefined) ? circleRadius : 10;

    let self = Object.assign(
        {
            _draw: function() {
                c.beginPath();
                c.arc(this.x(), this.y(), radius, 0, Math.PI * 2, false);
                c.stroke();
                c.fill();
            },
            _xstart: function() {
                return this.x() - radius;
            },
            _xend: function() {
                return this.x() + radius;
            },
            _ystart: function() {
                return this.y();
            },
            _yend: function() {
                return this.y() + radius;
            }
        },
        Entity(),
    );

    if (position !== undefined) {
        self.x(position.x());
        self.y(position.y());
    }

    return self;
}


let wall = Rectangle(50, 50, Coordinates(400, 300));
let rectangle = Rectangle(100, 100, Coordinates(100, 100));
let circle = Circle(20, Coordinates(300, 200));

let objectX = document.querySelector('#info .object .x');
let objectY = document.querySelector('#info .object .y');

let divMapWidth = document.querySelector('#info .map .x');
let divMapHeight = document.querySelector('#info .map .y');

//let logger = Object.create(Logger).init(divMapWidth, divMapHeight);
//logger.add(particle, objectX, objectY);

//particle.setLogger(logger);

var entities = [circle, rectangle];

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let entity of entities) {
        entity.draw();

        if (entity.collides(wall)) {
            entity.bounce(wall);
        }
        entity.checkWallCollision();
        entity.changePos();
    }

    wall.draw();
}

animate();
