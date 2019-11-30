<template lang="pug">
    .slider-group
        h2 Controls
        .input.ml-1 How does the face feel?
        .left Calm
        .right Aroused
        .input
            input(style="min:0;max:100;value:50" type="range" v-model="state.arousal" @change="change")
        .left Rejected
        .right Confirmed
        .input
            input(style="min:0;max:100;value:50" type="range" v-model="state.valence" @change="change")
        .left Insecure
        .right In control
        .input
            input(style="min:0;max:100;value:50" type="range" v-model="state.potency" @change="change")
        .left Equal
        .right Arrogant
        .input
            input(style="min:0;max:100;value:50" type="range" v-model="state.contempt" @change="change")
        hr
        .left
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

<style scoped>
.slider-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 90%;
}
h2, .input {
    grid-column: 1 / 3;
}
.left {
    grid-column: 1;
    margin-left: 5px;
}
.right {
    text-align: right;
    grid-column: 2;
}
input {
    width: 100%;
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
