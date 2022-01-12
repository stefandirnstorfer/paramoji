<template lang="pug">
.root()
    .at-work.main(v-if="mode=='EDIT' && currentTask")
        h2.title Which face matches the emoticon? ({{currentIndex +1}}/{{work.items.length}})
        div.image.portrait
          emoticon-display(:state="currentTask.emotion" color="none")
        div.controls.portrait
            .choice.image(v-for="(choice,index) in currentTask.choices"
                :class="{selected : currentTask.selected == index}"
                @click="select(index)"
                :style="image(choice)")
        div.text-left.m-3
        div.text-right.m-3
            button.btn.btn-outline-primary.mr-1(@click="back" v-if="currentIndex>0 && !complete") Back
            button.btn.btn-primary(@click="next" v-if="currentTask.selected >= 0") Continue
            button.btn.btn-secondary.disabled(v-if="currentTask.selected < 0") Continue
    .final-check.main(v-if="mode=='CHECK'")
        h2.title Final check
        .big-view.work-list
            .work-check(v-for="(task,i) in work.items" @click="edit(i)")
                .image.btn(:style="image(task.choices[task.selected])")
                emoticon-display.btn(:state="task.emotion")
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
                emoticon-display(style="height:20vh; overflow:hidden" :state="{valence: 90, arousal:30, potency: 60, contempt: 0, expression:80}" color="none")
            .card.big-view
                .card-header.bg-primary.text-white Thank you for completing your work.
                .card-body.display-4.mwcode {{ workConfirmation }}
</template>

<script>
import axios from 'axios'
import EmoticonDisplay from './EmoticonDisplay.vue'
import {randomStates, choose} from './sampler.js'

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
            },
            workConfirmation: "Waiting for server",
            complete: false,
            finalCheck: false,
            mode: "EDIT"
        }
    },
    async created() {
        const storedWork= sessionStorage.getItem(this.task.id)
        if (storedWork) {
            this.work.items = JSON.parse(storedWork);
        }
        const files = this.task.data.map(entry => entry.file)
        this.currentChoices = randomStates(this.$root.AB)
        while (this.work.items.length < TASK_LEN) {
            const pick= Math.floor(Math.random()*this.task.data.length)
            const entry= this.task.data[pick]
            console.log(entry)
            const batch= Math.floor(Math.random() * entry.decoy_sets.length)
            this.work.items.push({
                file: entry.file,
                batch,
                emotion: entry[this.ab],
                choices: entry.decoy_sets[batch],
                selected: -1,
                startTime: 0
            });
            this.task.data.splice(pick, 1)
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
            this.workConfirmation = await this.$root.saveWork(this.work)
            sessionStorage.removeItem(this.task.id)
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
                if (this.currentTask.selected == -1) {
                    this.currentTask.startTime = Date.now()
                }
            } else {
                this.mode="CHECK"
            }
        }
    },
    components: {
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
    padding: 10px;
    overflow-y: hidden;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 10px;
}
.selected {
    background-color: lightsteelblue;
    border: 3px solid darkblue;
}
.choice {
    height: 100%;
    overflow: hidden;
}
.recycle.btn {
  place-self: center;
  font-size: 40px;
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
.mwcode {
  overflow-wrap: anywhere
}
</style>
