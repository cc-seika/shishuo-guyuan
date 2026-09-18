const { getFrameStyle } = require("../../utils/fit-frame");

Page({
  data: {
    frameStyle: "",
    consentAccepted: false,
  },

  onLoad() {
    this.setData({ frameStyle: getFrameStyle() });
  },

  onResize(event) {
    this.setData({ frameStyle: getFrameStyle(event) });
  },

  toggleConsent() {
    this.setData({ consentAccepted: !this.data.consentAccepted });
  },

  wechatLogin() {
    if (!this.data.consentAccepted) {
      wx.showToast({ title: "请先勾选并同意协议", icon: "none" });
      return;
    }
    wx.reLaunch({ url: "/pages/home/home" });
  },
});
