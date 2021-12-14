<template lang="pug">
    .root(v-if="campaignId && workerId")
        .at-work.main(v-if="mode=='EDIT' && currentTask")
            h2.title How does the person feel? Find the best fit. ({{currentIndex +1}}/{{work.items.length}})
            div.image.portrait(:style="image(currentTask)")
            div.controls.portrait
                .choice(v-for="(choice,index) in currentTask.choices"
                    :class="{selected : currentTask.selected == index}"
                    @click="select(index)")
                    emoticon-display(:state="choice")
                button.btn.recycle(@click="resample()")  &#x267B;
            div.text-left.m-3
            div.text-right.m-3
                button.btn.btn-outline-primary.mr-1(@click="back" v-if="currentIndex>0 && !complete") Back
                button.btn.btn-primary(@click="next" v-if="currentTask.selected >= 0") Continue
                button.btn.btn-secondary.disabled(v-if="currentTask.selected < 0") Continue
        .final-check.main(v-if="mode=='CHECK'")
            h2.title Final check
            .big-view.work-list
                .work-check(v-for="(task,i) in work.items" @click="edit(i)")
                    .image.btn(:style="image(task)")
                    emoticon-display.btn(:state="task.choices[task.selected]")
            div.text-left.m-3
                label.ml-3
                    input.form-check-input(type="checkbox" v-model="finalCheck")
                    | I've checked all emotions
            div.text-right.m-3
                button.btn.btn-primary(@click="finish" v-if="finalCheck") Finish
                button.btn.btn-secondary.disabled(v-if="!finalCheck") Finish
        .finished(v-if="mode=='FINISHED'")
            h2.title Complete
            .big-view
                div.text-center
                    emoticon-display(style="height:20vh; overflow:hidden" :state="{valence: 90, arousal:30, potency: 60, contempt: 0, expression:80}")
                .card.big-view
                    .card-header.bg-primary.text-white Thank you for completing your work.
                    .card-body.display-4 {{ workConfirmation }}

</template>

<script>
import axios from 'axios'
import * as d3 from 'd3'
import EmotionControls from './EmotionControls'
import EmoticonDisplay from './EmoticonDisplay'
import {randomStates} from './sampler.js'

const TASK_LEN= 20;

export default {
    props: ['campaignId', 'workerId', 'taskId'],
    data() {
        return {
            currentTask: null,
            currentChoices: [],
            currentIndex: -1,
            work: {
                items: [],
                startTime: Date.now(),
                endTime: 0,
                campaignId: this.campaignId,
                workerId: this.workerId,
                taskId: this.taskId
            },
            workId: [this.campaignId, this.workerId, this.taskId].join('/'),
            workConfirmation: "Waiting for server",
            complete: false,
            finalCheck: false,
            mode: "EDIT"
        }
    },
    async created() {
        const data = await d3.csv(BASE_URL+"/emoticon-data/selection.csv")
        const storedWork= sessionStorage.getItem(this.workId)
        if (storedWork) {
            this.work.items = JSON.parse(storedWork);
        }
        this.currentChoices = randomStates(this.$root.AB)
        while (this.work.items.length < TASK_LEN) {
            const pick= Math.floor(Math.random()*data.length)
            this.work.items.push({
                file: data[pick].file,
                choices: null,
                sample: 1,
                selected: -1,
                startTime: 0
            });
            data.splice(pick, 1)
        }
        this.edit(0)
        if (!BASE_URL)
          await axios.get(BASE_URL+'/api/ping').catch(() => { throw new Error("Server not available")})
    },
    methods: {
        image(entry) {
            return {'background-image': `url(${BASE_URL+"/emoticon-data/"+entry.file})`}
        },
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
            sessionStorage.setItem(this.workId, JSON.stringify(this.work.items))
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
            this.work.endTime= Date.now()
            const response = await axios.post(BASE_URL+'/api', this.work)
            this.workConfirmation = response.data.code;
            this.mode='FINISHED'
        }
    },
    watch: {
        currentIndex(value, old) {
            if (this.currentTask) {
                this.currentTask.endTime= Date.now()
            }
            if (value < TASK_LEN) {
                this.currentTask = this.work.items[this.currentIndex]
                if (!this.currentTask.choices) {
                    this.currentTask.choices = this.currentChoices
                }
                if (!this.currentTask.startTime) {
                    this.currentTask.startTime = Date.now()
                }
            } else {
                this.mode="CHECK"
            }
        }
    },
    components: {
        'emotion-controls' : EmotionControls,
        'emoticon-display' : EmoticonDisplay
    }
};
</script>

<style scoped>
.main {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 1fr 1fr min-content;
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
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
}
.selected {
    background-color: lightsteelblue;
}
.choice {
    height: 100%;
    overflow: hidden;
}
.recycle.btn {
  place-self: center;
  font-size: 40px;
  margin-top: -1ex;
  margin-bottom: -1ex;
}

.image {
    width:100%;
    height:100%;
    max-width: 500px;
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
    padding-top: 1em;
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
    .portrait { grid-column: 1/3 }
}
@media (orientation: landscape) {
    .portrait { grid-row: 2/4 }
}

</style>
