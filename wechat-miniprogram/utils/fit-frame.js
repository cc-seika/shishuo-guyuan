const DESIGN_WIDTH = 591;
const DESIGN_HEIGHT = 1280;
const DESIGN_RATIO = DESIGN_WIDTH / DESIGN_HEIGHT;

function getWindowSize(resizeEvent) {
  if (resizeEvent && resizeEvent.size) {
    return {
      width: resizeEvent.size.windowWidth,
      height: resizeEvent.size.windowHeight,
    };
  }

  const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
  return {
    width: info.windowWidth,
    height: info.windowHeight,
  };
}

function getFrameStyle(resizeEvent) {
  const size = getWindowSize(resizeEvent);
  let width = size.width;
  let height = width / DESIGN_RATIO;

  if (height > size.height) {
    height = size.height;
    width = height * DESIGN_RATIO;
  }

  return `width:${width.toFixed(2)}px;height:${height.toFixed(2)}px;`;
}

module.exports = {
  getFrameStyle,
};
