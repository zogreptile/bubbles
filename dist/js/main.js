$(function () {
    var c = {
        cursorZone: 200
    };

    var canvas = document.getElementById('bubbles'),
        ctx = canvas.getContext('2d');

    canvas.width = $('body').width() - 20;
    canvas.height = $('body').height() - 20;

    function Ball (x, y, radius, color) {
        var self = this;
        this.initX = x || 10;
        this.initY = y || 10;
        this.x = x || 10;
        this.y = y || 10;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.9;
        this.tension = 0.01;
        this.radius = radius || 10;
        this.color = color || '#ff4500';

        this.draw = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(self.x, self.y, self.radius, 0, 2 * Math.PI);
            ctx.fillStyle = self.color;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            return self;
        }

        this.setPos = function (x, y) {
            self.x = x;
            self.y = y;
            return self;
        }

        this.calculation = function (mouseX, mouseY) {
            var dx = self.x - mouseX,
                dy = self.y - mouseY;

            var dist = Math.sqrt(dx * dx + dy * dy);
            
            //Задать ускорение, если точка попала в зону курсора
            if (dist < c.cursorZone) {
                var angle = Math.atan2(dy, dx),
                    tx = mouseX + Math.cos(angle) * c.cursorZone,
                    ty = mouseY + Math.sin(angle) * c.cursorZone;

                self.vx += tx - self.x;
                self.vy += ty - self.y;
            }

            //Притяжение к исходному положению
            var tdx = -(self.x - self.initX),
                tdy = -(self.y - self.initY);

            self.vx += tdx * self.tension;
            self.vy += tdy * self.tension;

            //Затухание скорости
            self.vx *= self.friction;
            self.vy *= self.friction;

            //Изменение скорости
            self.x += self.vx;
            self.y += self.vy;
        }
    }

    function Balloon (x, y, img, width, height) {
        Ball.call(this, x, y);

        var self = this;
        this.img = img;
        this.width = width;
        this.height = height;
        this.draw = function (ctx) {
            var im = new Image(self.width, self.height);
            im.src = self.img;
            ctx.drawImage(im, self.x, self.y, self.width, self.height);
            return self;
        }
    }
    
    var x, y,
        mouse = new Ball(0, 0, c.cursorZone, 'rgba(255, 255, 255, 0.1)'),
        mouseObj;

    document.addEventListener('mousemove', function (e) {
        mouseObj = e;
        x = e.clientX,
        y = e.clientY + $(document).scrollTop();
    });

    var balls = [];
    for (var i = 0; i < 50; i++) {
        var size = Math.random() * 40 + 40;

        balls.push(
            new Balloon(
                Math.random() * $(document).width(), 
                Math.random() * $(document).height(),
                '../img/bubble.png', 
                size,
                size
            )
        );
    }


    function render() {
        ctx.clearRect(0, 0, $('body').width(), $('body').height());

        balls.forEach(function (el) {
            el.calculation(x, y);
            el.draw(ctx);
        });

        mouse
          .setPos(x, y)
          .draw(ctx);

        window.requestAnimationFrame(render);
    }

    render();
});