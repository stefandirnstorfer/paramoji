<template lang="pug">
.root()
    .at-work.main(v-if="currentTask")
        h2.title Which face matches the emoticon? ({{currentIndex +1}}/{{work.items.length}})
        div.image.portrait
            emoticon-display(:state="currentTask.emotion" color="none")
        div.controls.portrait
            emotic-image.choice(
                v-for="(choice,index) in currentTask.choices"
                :item="task.images[choice]"
                :strokeScale="1.5"
                @click="select(index)"
                :class="{selected : currentTask.selected == index}"
                )
        div.text-left.m-3
        div.text-right.m-2
            button.btn.btn-outline-primary.mr-1(@click="back" v-if="currentIndex>0 && !complete") Back
            button.btn.btn-primary(@click="next" v-if="currentTask.selected >= 0") Continue
            button.btn.btn-secondary.disabled(v-if="currentTask.selected < 0") Continue
</template>

<script>
import axios from 'axios'
import EmoticonDisplay from './EmoticonDisplay.vue'
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
            },
            complete: false,
            finalCheck: false,
        }
    },
    async created() {
        const storedWork= sessionStorage.getItem(this.task.id)
        if (storedWork) {
            this.work.items = JSON.parse(storedWork);
        }
        //this.task.items = this.task.items.filter(x => x.group == ['A','B','C'][this.group])
        shuffleArray(this.task.items)
        while (this.work.items.length < TASK_LEN) {
            const entry= this.task.items.pop()
            const batch= [entry.image]
            const images = Object.keys(this.task.images)
            while (batch.length < 4) {                
                const i = Math.floor(Math.random() * images.length)
                if (!batch.includes(images[i]))
                    batch.push(images[i])
            }
            shuffleArray(batch)
            let emotion
            if (entry.group == 'A') emotion = entry.paramoji
            if (entry.group == 'B') emotion = {"code": entry.emoji}
            if (entry.group == 'C') emotion = {"label": entry.label}
            this.work.items.push({
                image: entry.image,
                choices: batch,
                emotion: emotion,
                selected: -1,
                startTime: 0
            });
        }
        this.edit(0)
    },
    methods: {
        image(entry) {
            const image = this.task.images[entry]
            return {'background-image': `url(${BASE_URL+"/emoticon-data/"+image.file})`}
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
        },
        async finish() {
            await this.$root.saveWork(this.work)
            sessionStorage.removeItem(this.task.id)
        }
    },
    watch: {
        async currentIndex(value, old) {
            if (this.currentTask) {
                this.currentTask.endTime= Date.now()
            }
            if (value < TASK_LEN) {
                this.currentTask = this.work.items[this.currentIndex]
                if (this.currentTask.selected == -1) {
                    this.currentTask.startTime = Date.now()
                }
            } else {
                await this.finish()
            }
        }
    },
    components: {
        'emoticon-display' : EmoticonDisplay,
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
  grid-template-rows: min-content 1fr 2fr min-content;
  grid-template-columns: 1fr 2fr;
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
    padding: 0 10px 0 0;
    overflow-y: hidden;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 10px;
}
.selected {
    background-color: lightsteelblue;
    border: 3px solid darkblue;
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
    justify-self: end;
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
