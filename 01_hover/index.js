// 定义状态
let rect = {
  x: 10,
  y: 10,
  width: 80,
  height: 60,
  hover: false
};

// 获取canvas元素
let canvasEle = document.querySelector('#myCanvas');
// 从Canvas元素上获取context
let ctx = canvasEle.getContext('2d');

/**
 * 画布渲染矩形的工具函数
 * @param ctx
 * @param rect
 */
function drawRect(ctx, rect) {
  // 暂存当前ctx的状态
  ctx.save();
  // 设置画笔颜色：黑色
  ctx.strokeStyle = rect.hover ? '#F00' : '#000';
  // 矩形所在位置画一个黑色框的矩形
  ctx.strokeRect(rect.x - 0.5, rect.y - 0.5, rect.width, rect.height);
  // 恢复ctx的状态
  ctx.restore();
}

// 监听鼠标移动
canvasEle.addEventListener('mousemove', ev => {
  // 移动事件对象，从中解构clientX和clientY
  let {clientX, clientY} = ev;
  // 解构canvas的boundingClientRect中的left和top
  let {left, top} = canvasEle.getBoundingClientRect();
  // 计算得到鼠标在canvas上的坐标
  let mousePositionInCanvas = {
    x: clientX - left,
    y: clientY - top
  };

  // console.log(mousePositionInCanvas);
  // 判断条件进行更新
  let inRect =
    (rect.x <= mousePositionInCanvas.x && mousePositionInCanvas.x <= rect.x + rect.width)
    && (rect.y <= mousePositionInCanvas.y && mousePositionInCanvas.y <= rect.y + rect.height);
  console.log('mouse in rect: ' + inRect);
  rect.hover = inRect;
});


(function doRender() {
  requestAnimationFrame(() => {
    // 先清空画布
    ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);
    // 绘制矩形
    drawRect(ctx, rect);
    // 递归调用
    doRender(); // 递归
  })
})();

