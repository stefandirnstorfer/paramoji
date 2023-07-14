<template lang="pug">
.root()
    .at-work.main(v-if="currentTask")
        h3.title Describe the emotion ({{currentIndex +1}}/{{work.items.length}})
        emotic-image.image.portrait(v-if="group=='A'" :item="currentTask")
        emoticon-display.image.portrait(v-if="group=='B'" :state="currentTask.paramoji")
        emotion-controls.portrait(v-model="currentTask.value")
        div.text-left.m-3
        div.text-right.m-3
            button.btn.btn-outline-primary.mr-1(@click="back" v-if="currentIndex>0 && !complete") Back
            button.btn.btn-primary(@click="next" v-if="stepComplete") Continue
            button.btn.btn-secondary.disabled(v-if="!stepComplete") Continue
</template>

<script>
import axios from 'axios'
import EmoticonDisplay from './EmoticonDisplay.vue'
import EmojiSelector from "./EmojiSelector.vue";
import LabelSelector from "./LabelSelector.vue";
import ParamojiSelector from "./ParamojiSelector.vue";
import EmotionControls from "./EmotionControls.vue";
import EmoticImage from "./EmoticImage.vue";
import {randomStates, shuffleArray} from './sampler.js'

const TASK_LEN= 20;

export default {
    props: ['task', 'group'],
    data() {
        return {
            currentTask: null,
            currentChoices: [],
            currentIndex: -1,
            work: {
                items: [],
                version: 2,
            },
            complete: false,
            finalCheck: false,
        }
    },
    async created() {
        const storedWork= sessionStorage.getItem(this.group + this.task.id)
        if (storedWork) {
          this.work.items = JSON.parse(storedWork);
        } else {
          const data = this.task[this.group].slice()
          shuffleArray(data)
          while (this.work.items.length < TASK_LEN) {
            const entry = data.pop()
            this.work.items.push({
              ...entry,
              value: null,
              startTime: 0
            });
          }
        }
        this.edit(0)
    },
    methods: {
        select(index) {
            if (this.currentTask.selected == index) {
                this.next()
            } else {
                this.currentTask.selected = index
            }
        },
        resample() {
            this.currentTask.selected = -1
            this.currentTask.sample += 1
            this.currentChoices = randomStates(this.$root.AB)
            this.currentTask.choices = this.currentChoices
        },
        next() {
            sessionStorage.setItem(this.group + this.task.id, JSON.stringify(this.work.items))
            if (this.complete) {
                this.currentIndex= this.work.items.length
            } else {
                this.currentIndex++
                if (this.currentIndex >= this.work.items.length) {
                    this.complete= true;
                }
            }
        },
        back() {
            this.currentIndex--
        },
        edit(i) {
            this.currentIndex= i
        },
        async finish() {
            await this.$root.saveWork(this.work)
            sessionStorage.removeItem(this.group + this.task.id)
        }
    },
    computed: {
        stepComplete() { return this.currentTask.value }
    },
    watch: {
        async currentIndex(value, old) {
            if (this.currentTask) {
                this.currentTask.endTime= Date.now()
            }
            if (value < TASK_LEN) {
                this.currentTask = this.work.items[this.currentIndex]
                if (!this.currentTask.startTime) {
                    this.currentTask.startTime = Date.now()
                }
            } else {
                await this.finish()
            }
        }
    },
    components: {
        'emoticon-display' : EmoticonDisplay,
        'label-selector' : LabelSelector,
        'emoji-selector' : EmojiSelector,
        'paramoji-selector' : ParamojiSelector,
        'emotic-image' : EmoticImage,
        'emotion-controls' : EmotionControls,    }
};
</script>

<style scoped>
.main {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 1fr 1.1fr min-content;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  justify-items: center;
}

.title {
    width: 100%;
    background-color: gainsboro;
    grid-column: 1 / 3;
    padding: 3px;
}

.controls {
    width: 100%;
    margin: 10px;
    overflow-y: hidden;
}
.selected {
    background-color: lightsteelblue;
}

.image {
    width:100%;
    height:100%;
    overflow: hidden;
    text-align: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}
.text-left {
    padding-top: 1em;
    justify-self: start;
}
.text-right {
    justify-self: end;
}
.big-view {
    grid-column: 1 / 3;
    grid-row: 2 / 4;
    display: grid;
    overflow-y: auto;
    margin: 3ex;
}

.work-list {
    width: 100%;
    grid-template-columns: repeat(auto-fill, 330px);
    justify-content: start;
}

.work-check {
    width: 300px;
    height: 150px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1em;
    padding: 1ex;
    border: 1px solid black;
}
.work-check:hover {
    background-color: gainsboro;
}
@media (orientation: portrait) {
    .portrait {
      grid-column: 1/3;
      min-height: 15%
    }
}
@media (orientation: landscape) {
    .portrait { grid-row: 2/4 }
}
</style>
