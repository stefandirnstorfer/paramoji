<template lang="pug">
svg(width="100%" height="100%" viewBox="-2 -2 404 404")
    image(:width="item.Width" :height="item.Height" :href="url()" preserveAspectRatio="none")
    rect(:x="item.X_min" :y="item.Y_min"
         :width="(item.X_max - item.X_min)"
         :height="(item.Y_max - item.Y_min)"
         fill="none" stroke="red" :stroke-width="item.Height/150")
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    update() {
      this.$el.setAttribute('viewBox', '-2 -2 '+(this.item.Width + 2)+' '+(this.item.Height + 2))
    },
    url() {
      return BASE_URL + "/emoticon-data/" + this.item.file
    },
  },
  watch: {
    item() { this.update() }
  }
};
</script>

<style scoped>
</style>
