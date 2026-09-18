const { getFrameStyle } = require("../../utils/fit-frame");

Page({
  data: { frameStyle: "" },

  onLoad() {
    this.setData({ frameStyle: getFrameStyle() });
  },

  onResize(event) {
    this.setData({ frameStyle: getFrameStyle(event) });
  },

  goHome() {
    wx.reLaunch({ url: "/pages/home/home" });
  },

  goCulture() {
    wx.navigateBack({
      delta: 1,
      fail() {
        wx.redirectTo({ url: "/pages/guide/guide" });
      },
    });
  },

  showFamilyNotice() {
    wx.showToast({ title: "亲子探索线将在下一版接入", icon: "none" });
  },

  showNavigationNotice() {
    wx.showToast({ title: "实时定位导航将在下一版接入", icon: "none" });
  },
});
