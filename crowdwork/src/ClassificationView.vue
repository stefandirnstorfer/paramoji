<template lang="pug">
.root()
    .at-work.main(v-if="mode=='EDIT' && currentTask")
        h3.title Find the matching emoji ({{currentIndex +1}}/{{work.items.length}})
        emotic-image.image.portrait(:item="currentTask")
        paramoji-selector.portrait(v-model="currentTask.paramoji" @complete="next")
        div.text-left.m-3
        div.text-right.m-3
            button.btn.btn-outline-primary.mr-1(@click="back" v-if="currentIndex>0 && !complete") Back
            button.btn.btn-primary(@click="next" v-if="stepComplete") Continue
            button.btn.btn-secondary.disabled(v-if="!stepComplete") Continue
    .final-check.main(v-if="mode=='CHECK'")
        h2.title Final check
        .big-view.work-list
            .work-check(v-for="(task,i) in work.items" @click="edit(i)")
                emotic-image.image.btn(:item="task")
                emoticon-display.btn(:state="task.paramoji.value")
        div.text-left.m-3
            label.ml-3
                input.form-check-input(type="checkbox" v-model="finalCheck")
                | I've checked all emotions
        div.text-right.m-1
            button.btn.btn-primary(@click="finish" v-if="finalCheck") Finish
            button.btn.btn-secondary.disabled(v-if="!finalCheck") Finish
    .finished(v-if="mode=='FINISHED'")
        h2.title Complete
        .big-view
            div.text-center
                emoticon-display(style="height:20vh; overflow:hidden" :state="[.9,.3,1.0,.6,0]")
            .card.big-view
                .card-header.bg-primary.text-white Thank you for completing your work.
                .card-body.display-4.mwcode {{ workConfirmation }}

</template>

<script>
import axios from 'axios'
import EmoticonDisplay from './EmoticonDisplay.vue'
import ParamojiSelector from "./ParamojiSelector.vue";
import EmoticImage from "./EmoticImage.vue";
import {randomStates, shuffleArray} from './sampler.js'

const TASK_LEN= 20;

export default {
    props: ['task', 'ab'],
    data() {
        return {
            currentTask: null,
            currentChoices: [],
            currentIndex: -1,
            work: {
                items: [],
                version: 2,
            },
            workConfirmation: "Waiting for server",
            complete: false,
            finalCheck: false,
            mode: "EDIT"
        }
    },
    async created() {
        const data = this.task.data.slice()
        const storedWork= sessionStorage.getItem(this.task.id)
        if (storedWork) {
            this.work.items = JSON.parse(storedWork);
        }
        shuffleArray(data)
        data.sort((b,a) => (a.published?0:1) - (b.published?0:1))
        while (this.work.items.length < TASK_LEN) {
            const entry = data.pop()
            this.work.items.push({
                ...entry,
                paramoji: {},
                startTime: 0
            });
        }
        shuffleArray(this.work.items)
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
            sessionStorage.setItem(this.task.id, JSON.stringify(this.work.items))
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
            this.mode='EDIT'
        },
        async finish() {
            for (let item of this.work.items) delete item.paramoji['choices']
            this.workConfirmation = await this.$root.saveWork(this.work)
            sessionStorage.removeItem(this.task.id)
            this.mode='FINISHED'
        }
    },
    computed: {
        stepComplete() { return this.currentTask.paramoji.iteration }
    },
    watch: {
        currentIndex(value, old) {
            if (this.currentTask) {
                this.currentTask.endTime= Date.now()
            }
            if (value < TASK_LEN) {
                this.currentTask = this.work.items[this.currentIndex]
                if (!this.currentTask.startTime) {
                    this.currentTask.startTime = Date.now()
                }
            } else {
                this.mode="CHECK"
            }
        }
    },
    components: {
        'emoticon-display' : EmoticonDisplay,
        'paramoji-selector' : ParamojiSelector,
        'emotic-image' : EmoticImage
    }
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
    padding: 3ex;
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
.mwcode {
  overflow-wrap: anywhere
}
</style>
