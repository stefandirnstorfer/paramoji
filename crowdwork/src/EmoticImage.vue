<template lang="pug">
svg(width="100%" height="100%" viewBox="-2 -2 404 404")
    image(:width="width" :height="height" :href="url()" :preserveAspectRatio="aspectRatio")
    rect(v-if="item.X_min" :x="item.X_min" :y="item.Y_min"
         :width="(item.X_max - item.X_min)"
         :height="(item.Y_max - item.Y_min)"
         fill="none" stroke="red" :stroke-width="strokewidth")
</template>

<script>
export default {
  props: ['item', 'rect'],
  data() {
    return {
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    update() {
      let vb = ''
      if (!this.item.Width && !this.item.X_min) {
        vb = "0 0 100 100"
      } else if (!this.rect) {
        vb = (this.item.X_min - 5) + ' ' + (this.item.Y_min - 5) + ' ' +
            (this.item.X_max - this.item.X_min + 10) + ' ' +
            (this.item.Y_max - this.item.Y_min + 10)
      } else {
        vb = '-2 -2 ' + (this.item.Width + 2) + ' ' + (this.item.Height + 2)
      }
      this.$el.setAttribute('viewBox', vb)
    },
    url() {
      return this.item.url ||
          (BASE_URL + "/emoticon-data/" + this.item.file)
    },
  },
  computed: {
    strokewidth() {
      if (this.rect)
        return this.item.Height / 150
      else
        return (this.item.Y_max - this.item.Y_min) / 100
    },
    width() { return this.item.Width || 100 },
    height() { return this.item.Height || 100 },
    aspectRatio() { return this.width && this.height ? "none" : "xMidYMid" }
  },
  watch: {
    item() { this.update() }
  }
};
</script>

<style scoped>
</style>
