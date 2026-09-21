const { getFrameStyle } = require("../../utils/fit-frame");
const { isFavorite, toggleFavorite } = require("../../utils/favorites");

Page({
  data: { frameStyle: "", isFavorite: false },

  onLoad() {
    this.setData({ frameStyle: getFrameStyle() });
  },

  onShow() {
    this.setData({ isFavorite: isFavorite("family") });
  },

  onResize(event) {
    this.setData({ frameStyle: getFrameStyle(event) });
  },

  goHome() {
    wx.reLaunch({ url: "/pages/home/home" });
  },

  goCulture() {
    wx.redirectTo({ url: "/pages/guide/guide" });
  },

  goLeisure() {
    wx.redirectTo({ url: "/pages/leisure/leisure" });
  },

  toggleFavorite() {
    const saved = toggleFavorite("family");
    this.setData({ isFavorite: saved });
    wx.showToast({ title: saved ? "已收藏亲子探索线" : "已取消收藏", icon: "none" });
  },

  showNavigationNotice() {
    wx.showToast({ title: "实时定位导航将在下一版接入", icon: "none" });
  },
});
