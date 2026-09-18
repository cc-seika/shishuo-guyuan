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

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
      return;
    }
    wx.reLaunch({
      url: "/pages/home/home",
    });
  },

  goLeisure() {
    wx.navigateTo({
      url: "/pages/leisure/leisure",
    });
  },

  showFamilyNotice() {
    wx.showToast({
      title: "亲子探索线将在下一版接入",
      icon: "none",
    });
  },

  showNavigationNotice() {
    wx.showToast({
      title: "实时定位导航将在下一版接入",
      icon: "none",
    });
  },
});
