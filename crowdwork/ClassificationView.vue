<template lang="pug">
    .root(v-if="campaignId && workerId")
        .qualify.main(v-if="mode=='QUALIFY'")
            h2.title Qualification
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
            h2.title Emotion classification (step {{currentIndex +1}}/{{work.items.length}})
            div.image(:style="image(currentTask)")
            div.text-center
                | Match the emotional expression as good as possible.
            emoticon-display.display(:state="currentTask.state")
            div.controls
                emotion-controls(v-model="currentTask.state" @change="touch(currentTask)")
            div.text-left.m-3
                button.btn.btn-outline-primary.mr-1(@click="back" v-if="currentIndex>0 && !complete") Back
            div.text-right.m-3
                button.btn.btn-primary(@click="next" v-if="currentTask.touches > -2") Continue
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
                    .card-body This is your confirmation key
                div.text-secondary.mt-3 Work result:
                    br
                    | {{ work }}
</template>

<script>
import EmotionControls from './EmotionControls'
import EmoticonDisplay from './EmoticonDisplay'
import * as d3 from 'd3'

const TASK_LEN= 5;

export default {
    props: ['campaignId', 'workerId'],
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
                workerId: this.workerId
            },
            complete: false,
            finalCheck: false,
            mode: "QUALIFY"
        }
    },
    async created() {
        const data = await d3.csv(IMAGE_BASE_URL+"/selection.csv")
        for (let i = 0; i< TASK_LEN; ++i) {
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
    },
    methods: {
        image(entry) {
            return {'background-image': `url(${IMAGE_BASE_URL+"/"+entry.file})`}
        },
        touch(item) {
            item.touches ++;
        },
        next() {
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
        finish() {
            this.work.endTime= Date.now()
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
                Math.pow(this.qualifyState.valence-63,2) +
                Math.pow(this.qualifyState.arousal-31,2) +
                Math.pow(this.qualifyState.potency-77,2) +
                Math.pow(this.qualifyState.contempt-19,2)
            )
            return dist < 15
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
    grid-column: 2
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
