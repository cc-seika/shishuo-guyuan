const { getFrameStyle } = require("../../utils/fit-frame");

Page({
  data: {
    frameStyle: "",
  },

  onLoad() {
    this.setData({ frameStyle: getFrameStyle() });
  },

  onResize(event) {
    this.setData({ frameStyle: getFrameStyle(event) });
  },

  goHome() {
    wx.reLaunch({ url: "/pages/home/home" });
  },

  goGuide() {
    wx.reLaunch({ url: "/pages/guide/guide" });
  },
});
