import Vue from "vue"
import ClassificationView from "./ClassificationView"

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: {
      'classification-view' : ClassificationView
  },
  template: "<classification-view/>"
});
