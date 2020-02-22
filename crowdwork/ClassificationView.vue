<template lang="pug">
    .root(v-if="campaignId && workerId")
        .at-work.main(v-if="mode=='EDIT' && currentTask")
            h2.title Find the best match ({{currentIndex +1}}/{{work.items.length}})
            div.image.portrait(:style="image(currentTask)")
            div.controls.portrait
                .choice(v-for="(choice,index) in currentTask.choices"
                    :class="{selected : currentTask.selected == index}"
                    @click="select(index)")
                    emoticon-display(:state="choice")
            div.text-left.m-3
                button.btn.btn-outline-primary.mr-1(@click="back" v-if="currentIndex>0 && !complete") Back
            div.text-right.m-3
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
                    .card-header.bg-primary.text-white Congratulation! You completed your task.
                    .card-body.display-4 {{ workConfirmation }}
                    .card-body(v-if="autoSubmitted") Your work has been submitted to the server

</template>

<script>
import EmotionControls from './EmotionControls'
import EmoticonDisplay from './EmoticonDisplay'
import axios from 'axios'
import * as d3 from 'd3'

const TASK_LEN= 20;
const EMOJI=[0x1F600, 0x1F601, 0x1F602, 0x1F923, 0x1F603,
            0x1F604, 0x1F605, 0x1F606, 0x1F609, 0x1F60A,
            0x1F60B, 0x1F60E, 0x1F60D, 0x1F618, 0x1F617,
            0x1F619, 0x1F61A, 0x263A,  0x1F642, 0x1F917,
            0x1F929, 0x1F914, 0x1F928, 0x1F610, 0x1F611,
            0x1F644, 0x1F60F, 0x1F623, 0x1F625,
            0x1F62E, 0x1F910, 0x1F62F, 0x1F62A, 0x1F62B,
            0x1F634, 0x1F60C, 0x1F61B, 0x1F61C, 0x1F61D,
            0x1F924, 0x1F612, 0x1F613, 0x1F614, 0x1F615,
            0x1F911, 0x1F632, 0x2639,  0x1F641,
            0x1F616, 0x1F61E, 0x1F61F, 0x1F624, 0x1F622,
            0x1F62D, 0x1F626, 0x1F627, 0x1F628, 0x1F629,
            0x1F92F, 0x1F62C, 0x1F630, 0x1F631, 0x1F633,
            0x1F92A, 0x1F635, 0x1F621, 0x1F620,
            0x1F922, 0x1F92E];

export default {
    props: ['campaignId', 'workerId', 'taskId'],
    data() {
        return {
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
            autoSubmitted: false,
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
        while (this.work.items.length < TASK_LEN) {
            const pick= Math.floor(Math.random()*data.length)
            this.work.items.push({
                file: data[pick].file,
                choices: this.randomStates(),
                selected: -1,
                startTime: 0
            });
            data.splice(pick, 1)
        }
        this.edit(0)
        await axios.get(BASE_URL+'/api/ping').catch(() => { throw new Error("Server not available")})
    },
    methods: {
        image(entry) {
            return {'background-image': `url(${BASE_URL+"/emoticon-data/"+entry.file})`}
        },
        randomStates() {
            const states = [];
            while(states.length<9) {
                if (this.$root.AB=="B") {
                    var code = EMOJI[Math.floor(Math.random()*EMOJI.length)];
                    if (!states.find(x => x.code==code)) states.push({code});
                } else {
                    states.push({
                        valence: Math.round(Math.random()*100),
                        arousal: Math.round(Math.random()*100),
                        potency: Math.round(Math.random()*100),
                        contempt: Math.round(Math.max(2*Math.random()*100-100,0)),
                        expression: Math.round(Math.random()*100)
                    })
                }
            }
            return states;
        },
        select(index) {
            if (this.currentTask.selected == index) this.next()
            this.currentTask.selected = index
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
            this.autoSubmitted = response.data.autosubmit;
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
                if (this.currentTask.selected == -1) {
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

<style>
.main {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 1fr 1fr min-content;
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
    margin: 10px;
    overflow-y: hidden;
    display: grid;
    grid-template-columns: auto auto auto;
}
.selected {
    background-color: lightsteelblue;
}
.choice {
    height: 100%;
    overflow: hidden;
}

.image {
    max-width: 500px;
    margin: 10%;
    overflow: hidden;
    text-align: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}

.big-view {
    grid-column: 1 / 3;
    grid-row: 2 / 4;
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
@media (orientation: portrait) {
    .portrait { grid-column: 1/3 }
}
@media (orientation: landscape) {
    .portrait { grid-row: 2/4 }
}

</style>
