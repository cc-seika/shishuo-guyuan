const { getFrameStyle } = require("../../utils/fit-frame");

Page({
  data: { frameStyle: "" },

  onLoad() {
    this.setData({ frameStyle: getFrameStyle() });
  },

  onResize(event) {
    this.setData({ frameStyle: getFrameStyle(event) });
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.reLaunch({ url: "/pages/home/home" }) });
  },

  goNext() {
    wx.navigateTo({ url: "/pages/ai-guide-two/ai-guide-two" });
  },
});
