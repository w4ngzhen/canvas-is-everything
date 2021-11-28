// 1 定义常用工具方法
const utils = {

  /**
   * 工具方法：获取鼠标在画布上的position
   */
  getMousePositionInCanvas: (event, canvasEle) => {
    // 移动事件对象，从中解构clientX和clientY
    let {clientX, clientY} = event;
    // 解构canvas的boundingClientRect中的left和top
    let {left, top} = canvasEle.getBoundingClientRect();
    // 计算得到鼠标在canvas上的坐标
    return {
      x: clientX - left,
      y: clientY - top
    };
  },

  /**
   * 工具方法：检查点point是否在矩形内
   */
  isPointInRect: (rect, point) => {
    let {x: rectX, y: rectY, width, height} = rect;
    let {x: pX, y: pY} = point;
    return (rectX <= pX && pX <= rectX + width) && (rectY <= pY && pY <= rectY + height);
  },

};

// 2 定义状态
let rect = {
  x: 10,
  y: 10,
  width: 80,
  height: 60,
  selected: false,
};

// 3 获取canvas元素，准备在步骤
let canvasEle = document.querySelector('#myCanvas');

// 4 鼠标按下事件
canvasEle.addEventListener('mousedown', event => {
  // 获取鼠标按下时位置
  let {x, y} = utils.getMousePositionInCanvas(event, canvasEle);
  // 矩形是否被选中取决于点击时候的鼠标是否在矩形内部
  rect.selected = utils.isPointInRect(rect, {x, y});
});

// 5 鼠标移动处理
// 5.1 定义辅助变量，记录每一次移动的位置
let mousePosition = null;
canvasEle.addEventListener('mousemove', event => {

  // 5.2 记录上一次的鼠标位置
  let lastMousePosition = mousePosition;

  // 5.3 更新当前鼠标位置
  mousePosition = utils.getMousePositionInCanvas(event, canvasEle);

  // 5.4 判断是否鼠标左键点击且有矩形被选中
  // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
  let buttons = event.buttons;
  if (!(buttons === 1 && rect.selected)) {
    // 不满足则不处理
    return;
  }

  // 5.5 获取鼠标偏移
  let offset;
  if (lastMousePosition === null) {
    // 首次记录，偏移dx和dy为0
    offset = {
      dx: 0,
      dy: 0
    };
  } else {
    // 曾经已经记录了位置，则偏移则为当前位置和上一次位置做向量差
    offset = {
      dx: mousePosition.x - lastMousePosition.x,
      dy: mousePosition.y - lastMousePosition.y
    };
  }

  // 5.6 改动rect位置
  rect.x = rect.x + offset.dx;
  rect.y = rect.y + offset.dy;

});



// 6 鼠标抬起事件
canvasEle.addEventListener('mouseup', () => {
  // 鼠标抬起时，矩形就未被选中了
  rect.selected = false;
});

// 7 渲染
// 7.1 从Canvas元素上获取context
let ctx = canvasEle.getContext('2d');
(function doRender() {
  requestAnimationFrame(() => {

    // 7.2 处理渲染
    (function render() {
      // 先清空画布
      ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);
      // 暂存当前ctx的状态
      ctx.save();
      // 设置画笔颜色：黑色
      ctx.strokeStyle = rect.selected ? '#F00' : '#000';
      // 矩形所在位置画一个黑色框的矩形
      ctx.strokeRect(rect.x - 0.5, rect.y - 0.5, rect.width, rect.height);
      // 恢复ctx的状态
      ctx.restore();
    })();

    // 7.3 递归调用
    doRender();

  });
})();
