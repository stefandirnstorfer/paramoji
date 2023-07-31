<template lang="pug">
.root()
    .at-work.main(v-if="currentTask")
        h3.title.wide Describe the emotion ({{currentIndex +1}}/{{work.items.length}})
        h4.wide(v-if="group=='A'" :set1="a='negative'" :set2="b='positive'")
            | Which face is more #[b {{ a }}] (miserable, rejected); which is more #[b {{ b }}] (pleasuable, accepted) ?
        h4.wide(v-if="group=='B'" :set1="a='calm'" :set2="b='aroused'")
            | Which face is more #[b {{a}}] (sleepy, relaxed, unimpressed); which is more #[b {{b}}] (surprised, panicking, facing the unexpected) ?
        h4.wide(v-if="group=='C'" :set1="a='submissive'" :set2="b=''dominant")
            | Which face is more #[b {{a}}] (in doubt, passive, insecure); which is more #[b {{b}}] (focused, strong, activated)?
        h4.wide(v-if="group=='D'" :set1="a='uncontrolled'" :set2="b='controlled'")
            | Which face is more #[b {{ a }}] (overwhelmed, expressed); which is more #[b {{ b }}] (pretended, modulated, suppressed) ?
        h4.wide(v-if="group=='E'" :set1="a='humble'" :set2="b='contemptuous'")
            | Which face is more #[b {{a}}] (moderate, respectful); which is more #[b {{b}}] (self-loving, vain, disdainful) ?
        .portrait
            .empty
            emoticon-display.image(:state="currentTask.face1.paramoji")
            emotion-selector(v-model="currentTask.value1" :a="a" :b="b")
        .portrait
            .empty
            emoticon-display.image(:state="currentTask.face2.paramoji")
            emotion-selector(v-model="currentTask.value2" :a="a" :b="b")
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
import EmoticImage from "./EmoticImage.vue";
import EmotionSelector from "./EmotionSelector.vue";
import {randomStates, shuffleArray} from './sampler.js'

const TASK_LEN= 30;

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
          const data1 = this.task.B.slice()
          const data2 = this.task.B.slice()
          shuffleArray(data1)
          shuffleArray(data2)
          while (this.work.items.length < TASK_LEN) {
            this.work.items.push({
              face1: data1.pop(),
              face2: data2.pop(),
              value1: null,
              value2: null,
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
        stepComplete() { return this.currentTask.value1!==null && this.currentTask.value2!==null & this.currentTask.value1 === -this.currentTask.value2 },
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
        'emotion-selector' : EmotionSelector,
    }
};
</script>

<style scoped>
.main {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content min-content 1fr 1fr min-content min-content;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  justify-items: center;
}

.title {
    width: 100%;
    background-color: gainsboro;
    padding: 3px;
}
.wide {
    grid-column: 1 / 3;
    padding: 5px;
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
.portrait {
    width: 100%;
    height: 100%;
    display: grid;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}
.choice {
    text-align: center;
}
@media (orientation: portrait) {
    .portrait {
      grid-column: 1/5;
      min-height: 15%
    }
}
@media (orientation: landscape) {
    .portrait { grid-row: 3/5 }
}
</style>
