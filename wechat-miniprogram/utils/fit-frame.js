const DESIGN_WIDTH = 591;
const DESIGN_HEIGHT = 1280;
const DESIGN_RATIO = DESIGN_WIDTH / DESIGN_HEIGHT;

function getWindowMetrics(resizeEvent) {
  const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
  const width = resizeEvent && resizeEvent.size ? resizeEvent.size.windowWidth : info.windowWidth;
  const height = resizeEvent && resizeEvent.size ? resizeEvent.size.windowHeight : info.windowHeight;
  const safeArea = info.safeArea || { left: 0, right: width, top: 0, bottom: height };

  const leftInset = Math.max(0, safeArea.left || 0);
  const rightInset = Math.max(0, width - (safeArea.right || width));
  const topInset = Math.max(0, safeArea.top || 0);
  const bottomInset = Math.max(0, height - (safeArea.bottom || height));

  if (resizeEvent && resizeEvent.size) {
    return {
      width,
      height,
      leftInset,
      rightInset,
      topInset,
      bottomInset,
    };
  }

  return {
    width,
    height,
    leftInset,
    rightInset,
    topInset,
    bottomInset,
  };
}

function getFrameStyle(resizeEvent) {
  const size = getWindowMetrics(resizeEvent);
  const safeWidth = Math.max(1, size.width - size.leftInset - size.rightInset);
  const safeHeight = Math.max(1, size.height - size.topInset - size.bottomInset);
  let width = safeWidth;
  let height = width / DESIGN_RATIO;

  if (height > safeHeight) {
    height = safeHeight;
    width = height * DESIGN_RATIO;
  }

  const offsetX = (size.leftInset - size.rightInset) / 2;
  const offsetY = (size.topInset - size.bottomInset) / 2;
  return `width:${width.toFixed(2)}px;height:${height.toFixed(2)}px;transform:translate(${offsetX.toFixed(2)}px,${offsetY.toFixed(2)}px);`;
}

module.exports = {
  getFrameStyle,
};
