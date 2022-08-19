<template lang="pug">
.paramoji-main
  .choice.p-1(v-for="(choice,index) in choices")
    emoticon-display.clickable(
      :state="choice"
      :class="{selected: selection==index}"
      @click="select(choice,index)")

</template>

<script>
import {randomLabels} from './sampler.js'
import EmoticonDisplay from './EmoticonDisplay.vue'

export default {
  props: ['modelValue'],
  data() {
    return {
      backupChoices: [],
    }
  },
  async created() {
    this.resample(true)
  },
  methods: {
    resample(nopropagate) {
      this.backupChoices = randomLabels()
      if (this.selection)
        this.backupChoices[this.selection] = this.modelValue.value
      if (!nopropagate) {
        this.$emit('update:modelValue', {
          ...this.modelValue,
          iteration: this.iteration + 1,
          choices: this.backupChoices,
        })
      }
    },
    select(choice, index) {
      this.$emit('update:modelValue', {
        selection: index,
        iteration: this.iteration + 1,
        choices: this.choices,
        value: choice
      })
    }
  },
  computed: {
    selection() { return this.modelValue.selection == undefined ? -1 : this.modelValue.selection },
    iteration() { return this.modelValue.iteration || 0 },
    choices() { return this.modelValue.choices || this.backupChoices }
  },
  components: {
      'emoticon-display' : EmoticonDisplay,
  }
};
</script>

<style scoped>
.paramoji-main {
}
.choice {
  float: left;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  background-color: ghostwhite;
}
.clickable.selected {
  background-color: lightsteelblue;
}
</style>
