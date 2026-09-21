const { getFrameStyle } = require("../../utils/fit-frame");
const { isFavorite, toggleFavorite } = require("../../utils/favorites");

Page({
  data: {
    frameStyle: "",
    isFavorite: false,
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

  onShow() {
    this.setData({ isFavorite: isFavorite("culture") });
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

  goFamily() {
    wx.navigateTo({
      url: "/pages/family/family",
    });
  },

  toggleFavorite() {
    const saved = toggleFavorite("culture");
    this.setData({ isFavorite: saved });
    wx.showToast({ title: saved ? "已收藏文化研学线" : "已取消收藏", icon: "none" });
  },

  showNavigationNotice() {
    wx.showToast({
      title: "实时定位导航将在下一版接入",
      icon: "none",
    });
  },
});
