const { getFrameStyle } = require("../../utils/fit-frame");
const { ROUTES, getFavoriteDetails } = require("../../utils/favorites");
const { AI_LOCATIONS, getAIHistoryDetails } = require("../../utils/ai-history");

Page({
  data: {
    frameStyle: "",
    favorites: [],
    showFavorites: false,
    aiHistory: [],
    showAIHistory: false,
  },

  onLoad() {
    this.setData({ frameStyle: getFrameStyle() });
  },

  onResize(event) {
    this.setData({ frameStyle: getFrameStyle(event) });
  },

  onShow() {
    this.setData({ favorites: getFavoriteDetails(), aiHistory: getAIHistoryDetails() });
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

  openAIHistory() {
    this.setData({ aiHistory: getAIHistoryDetails(), showAIHistory: true });
  },

  closeAIHistory() {
    this.setData({ showAIHistory: false });
  },

  goAIHistory(event) {
    const location = AI_LOCATIONS[event.currentTarget.dataset.page];
    if (!location) return;
    wx.reLaunch({ url: location.url });
  },
});
