<template lang="pug">
    div
        h2 Controls
        .text Valence: {{state.valence}}
        input(style="width:90%;min:0;max:100;value:50" type="range" v-model="state.valence" @change="change")
        .text Arousal: {{state.arousal}}
        input(style="width:90%;min:0;max:100;value:50" type="range" v-model="state.arousal" @change="change")
        .text Control: {{state.potency}}
        input(style="width:90%;min:0;max:100;value:50" type="range" v-model="state.potency" @change="change")
        .text Contempt: {{state.contempt}}
        input(style="width:90%;min:0;max:100;value:50" type="range" v-model="state.contempt" @change="change")
        hr
        .text
            button.btn.btn-outline-primary(@click="reset") Reset
</template>

<script>
export default {
    props: [ 'value' ],
    components: {
    },
    data() {
        return {
            state: this.value
        }
    },
    created() {
        if (!this.state) this.reset()
    },
    methods: {
        reset() {
            this.state = {
                valence: 50,
                arousal: 50,
                potency: 50,
                contempt: 0
            }
        },
        changed() {
            this.$emit('input', this.state)
        },
        change() {
            this.$emit('change', this.state)
        }
    },
    watch : {
        value(newValue) { this.state = newValue },
        "state" : {
            handler() { this.changed() },
            deep: true
        }

    }
};
</script>

<style>
.text {
    margin: 5px;
}
input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 30px;
    cursor: pointer;
    background: #3071A9;
    border-radius: 5px;
    border: 1px solid #000000;
}

input[type=range]::-webkit-slider-thumb {
    border: 1px solid #000000;
    height: 28px;
    width: 10px;
    border-radius: 1px;
    background: #FFFFFF;
    cursor: pointer;
    -webkit-appearance: none;
}

input[type=range] {
    background: #3071A9;
    margin: 5px;
    height: 30px;
    -webkit-appearance: none;
}
</style>
