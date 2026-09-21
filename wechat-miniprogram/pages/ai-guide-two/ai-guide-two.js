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
    wx.reLaunch({ url: "/pages/home/home" });
  },

  goPrevious() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: "/pages/ai-guide-one/ai-guide-one" }) });
  },
});
