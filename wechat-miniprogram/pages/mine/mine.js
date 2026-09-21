const { getFrameStyle } = require("../../utils/fit-frame");
const { ROUTES, getFavoriteDetails } = require("../../utils/favorites");

Page({
  data: {
    frameStyle: "",
    favorites: [],
    showFavorites: false,
  },

  onLoad() {
    this.setData({ frameStyle: getFrameStyle() });
  },

  onResize(event) {
    this.setData({ frameStyle: getFrameStyle(event) });
  },

  onShow() {
    this.setData({ favorites: getFavoriteDetails() });
  },

  goHome() {
    wx.reLaunch({ url: "/pages/home/home" });
  },

  goGuide() {
    wx.reLaunch({ url: "/pages/guide/guide" });
  },

  openFavorites() {
    this.setData({ favorites: getFavoriteDetails(), showFavorites: true });
  },

  closeFavorites() {
    this.setData({ showFavorites: false });
  },

  goFavorite(event) {
    const route = ROUTES[event.currentTarget.dataset.route];
    if (!route) return;
    wx.reLaunch({ url: route.url });
  },
});
