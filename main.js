// 选择画布并获取绘图上下文
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 控制按钮
const addBallBtn = document.getElementById('addBall');
const removeBallBtn = document.getElementById('removeBall');
const pauseBtn = document.getElementById('pause');

let isPaused = false; // 是否暂停

// 随机数生成函数
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// 随机选择一个图标
const icons = [
  'images/img1.jpg',
  'images/img2.jpg',
  'images/img3.jpg',
  'images/img4.jpg',
  'images/img5.jpg',
  'images/img6.jpg',
  'images/img7.jpg',
  'images/img8.jpg'
];

// 球体类
function Ball(x, y, velX, velY, imgSrc, size, volume) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.img = new Image();
  this.img.src = imgSrc;
  this.size = size;
  this.volume = volume; // 体积属性
}

// 绘制球体
Ball.prototype.draw = function () {
  ctx.save(); // 保存当前绘图状态
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // 创建圆形路径
  ctx.closePath();
  ctx.clip(); // 应用裁剪，让图像显示为圆形

  // 绘制图像（图标会裁剪为圆形）
  ctx.drawImage(this.img, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);

  ctx.restore(); // 恢复绘图状态，避免影响其他绘制
};

// 更新球体位置
Ball.prototype.update = function () {
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }

  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }

  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }

  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }

  this.x += this.velX;
  this.y += this.velY;
};


// 碰撞检测和吞并机制
Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        // 反弹逻辑
        if (this.volume >= 80) {
          // 大球达到最大体积，进行反弹
          const tempVelX = this.velX;
          const tempVelY = this.velY;

          this.velX = balls[j].velX;
          this.velY = balls[j].velY;

          balls[j].velX = tempVelX;
          balls[j].velY = tempVelY;
        } else {
          // 大球未达到最大体积，执行吞并逻辑
          if (this.volume > balls[j].volume) {
            this.volume += balls[j].volume;  // 增加大球的体积
            this.size = Math.sqrt(this.volume) * 10;  // 更新大球的大小
            balls.splice(j, 1);  // 删除被吞并的小球
          }
        }
      }
    }
  }
};






// 初始化球体列表
let balls = [];

// 创建球体
function createBall() {
  let size = random(40, 60);
  let volume = size - 10;  // 初始体积为 size - 10
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    icons[random(0, icons.length)],  // 随机选择图标
    size,
    volume
  );
  balls.push(ball);
}

// 初始化生成 25 个球体
for (let i = 0; i < 25; i++) {
  createBall();
}

// 增加球体功能
addBallBtn.addEventListener('click', () => {
  createBall();
});

// 减少球体功能
removeBallBtn.addEventListener('click', () => {
  balls.pop();  // 删除最后一个球
});

// 暂停/继续功能
pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
});

// 主循环
function loop() {
  if (!isPaused) {

    ctx.clearRect(0, 0, width, height);
    

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  requestAnimationFrame(loop);
}

loop();
