<template lang="pug">
    .root(v-if="campaignId && workerId")
        .qualify.main(v-if="mode=='QUALIFY'")
            h2.title Training
            div.image(style="background-image:url(qualifyImage.png)")
            div.text-center
                p(v-if="!qualified") Match the emotional expression as good as possible. (Training)
                h2(v-if="qualified") Matched
            emoticon-display.display(:state="qualifyState")
            div.controls
                emotion-controls(v-model="qualifyState")
            div
            div.text-right.m-3
                button.btn.btn-primary(@click="edit(0)" v-if="qualified") Start
                button.btn.btn-secondary.disabled(v-if="!qualified") Start
        .at-work.main(v-if="mode=='EDIT'")
            h2.title Step {{currentIndex +1}}/{{work.items.length}}
            div.image(:style="image(currentTask)")
            div.text-center
                | Match the emotional expression as good as possible.
            emoticon-display.display(:state="currentTask.state")
            div.controls
                emotion-controls(v-model="currentTask.state" @change="touch(currentTask)")
            div.text-left.m-3
                button.btn.btn-outline-primary.mr-1(@click="back" v-if="currentIndex>0 && !complete") Back
            div.text-right.m-3
                button.btn.btn-primary(@click="next" v-if="currentTask.touches > 2") Continue
                button.btn.btn-secondary.disabled(v-if="currentTask.touches <=2") Continue
        .final-check.main(v-if="mode=='CHECK'")
            h2.title Final check
            .big-view.work-list
                .work-check(v-for="(task,i) in work.items" @click="edit(i)")
                    .image.btn(:style="image(task)")
                    emoticon-display.btn(:state="task.state")
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
                    emoticon-display(style="height:20vh; overflow:hidden" :state="{valence: 90, arousal:30, potency: 60, contempt: 0}")
                .card
                    .card-header.bg-primary.text-white Congratulation! You completed your task.
                    .card-body.display-4 {{ workConfirmation }}
                div.text-secondary.mt-3 Work result:
                    br
                    | {{ work }}
</template>

<script>
import EmotionControls from './EmotionControls'
import EmoticonDisplay from './EmoticonDisplay'
import axios from 'axios'
import * as d3 from 'd3'

const TASK_LEN= 15;

export default {
    props: ['campaignId', 'workerId', 'taskId'],
    data() {
        return {
            qualifyState: {valence: 50, arousal:50, potency: 50, contempt: 0},
            currentTask: null,
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
            mode: "QUALIFY"
        }
    },
    async created() {
        const data = await d3.csv(BASE_URL+"/emoticon-data/selection.csv")
        const storedWork= sessionStorage.getItem(this.workId)
        if (storedWork) {
            this.work.items = JSON.parse(storedWork);
        }
        while (this.work.items.length < TASK_LEN) {
            const pick= Math.floor(Math.random()*data.length)
            this.work.items.push({
                file: data[pick].file,
                state: {
                    valence: 50,
                    arousal: 50,
                    potency: 50,
                    contempt: 0
                },
                touches: 0,
                visits: 0,
                startTime: 0
            });
            data.splice(pick, 1)
        }
        await axios.get(BASE_URL+'/api/ping').catch(() => { throw new Error("Server not available")})
    },
    methods: {
        image(entry) {
            return {'background-image': `url(${BASE_URL+"/emoticon-data/"+entry.file})`}
        },
        touch(item) {
            item.touches ++;
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
            this.workConfirmation = response.data.code
            this.mode='FINISHED'
        }
    },
    watch: {
        currentIndex(value) {
            if (this.currentTask) {
                this.currentTask.endTime= Date.now()
            }
            if (value < TASK_LEN) {
                this.currentTask = this.work.items[this.currentIndex]
                if (this.currentTask.touches == 0) {
                    this.currentTask.startTime = Date.now()
                }
                this.currentTask.visits++
            } else {
                this.mode="CHECK"
            }
        }
    },
    computed: {
        qualified() {
            const dist= Math.sqrt(
                Math.pow(this.qualifyState.valence-78,2) +
                Math.pow(this.qualifyState.arousal-29,2) +
                Math.pow(this.qualifyState.potency-17,2) +
                Math.pow(this.qualifyState.contempt-70,2)
            )
            return dist < 18
        }
    },
    components: {
        'emotion-controls' : EmotionControls,
        'emoticon-display' : EmoticonDisplay
    }
};
</script>

<style>
.main {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 2fr min-content 3fr min-content;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

.title {
    background-color: gainsboro;
    padding: 1px;
    grid-column: 1 / 3;
    padding: 3px;
}

.controls {
    grid-row: 2 / 5;
    grid-column: 2;
    overflow-y: auto;
}

.image {
    overflow: hidden;
    text-align: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}

.big-view {
    grid-row: 2 / 5;
    grid-column: 1 / 3;
    display: grid;
    overflow-y: auto;
    padding: 3ex;
}

.work-list {
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
</style>
