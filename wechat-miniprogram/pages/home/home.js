const { getFrameStyle } = require("../../utils/fit-frame");

Page({
  data: {
    frameStyle: "",
  },

  onLoad() {
    this.setData({
      frameStyle: getFrameStyle(),
    });
  },

  onResize(event) {
    this.setData({
      frameStyle: getFrameStyle(event),
    });
  },

  goGuide() {
    wx.navigateTo({
      url: "/pages/guide/guide",
    });
  },

  goMine() {
    wx.navigateTo({
      url: "/pages/mine/mine",
    });
  },
});
