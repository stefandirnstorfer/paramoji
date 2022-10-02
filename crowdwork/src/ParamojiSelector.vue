<template lang="pug">
.paramoji-main
  .choice.p-1(v-for="(choice,index) in choices")
    emoticon-display.clickable(
      :state="clamp(choice)"
      :class="{selected: selection==index}"
      @click="select(choice,index)")
  button.btn.recycle(@click="resample()")  &#x267B;

</template>

<script>
import {randomStates, converge} from './sampler.js'
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
      this.backupChoices = randomStates(15)
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
        choices: converge(this.choices, index, this.modelValue.selection),
        value: this.clamp(choice)
      })
    },
    clamp(state) {
      return state.map(x => Math.min(1.0, Math.max(0.0, x)))
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  width: 100%;
}
.choice {
  height: 100%;
  overflow: hidden;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  background-color: ghostwhite;
}
.clickable.selected {
  background-color: lightsteelblue;
  border-radius:200px;
}
.recycle.btn {
  place-self: center;
  font-size: 40px;
  margin-top: -1ex;
  margin-bottom: -1ex;
}
</style>
