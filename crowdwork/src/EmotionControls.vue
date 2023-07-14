<template lang="pug">
.slider-group
    .left Negative
    .right Positive
    .input
        input(style="min:0;max:100;value:50" type="range" v-model="state[0]" @change="change(0)")
    .left Calm
    .right Aroused
    .input(:class="enableOn(1)")
        input(style="min:0;max:100;value:50" type="range" v-model="state[1]" @change="change(1)")
    .left In doubt
    .right In control
    .input(:class="enableOn(2)")
        input(style="min:0;max:100;value:50" type="range" v-model="state[2]" @change="change(2)")
    .left Restrained
    .right Expressed
    .input(:class="enableOn(3)")
        input(style="min:0;max:100;value:50" type="range" v-model="state[3]" @change="change(3)")
    .left Humble
    .right Contemptful
    .input(:class="enableOn(4)")
        input(style="min:0;max:100;value:50" type="range" v-model="state[4]" @change="change(4)")
</template>

<script>
export default {
    props: [ 'modelValue' ],
    components: {
    },
    data() {
        return {
            state: this.modelValue || [50,50,50,50,50],
            changedTo: this.modelValue ? 5 : 0
        }
    },
    created() {
        if (!this.state) this.reset()
    },
    methods: {
        change(n) {
            this.changedTo = Math.max(this.changedTo, n + 1)
            if (this.changedTo > 4) {
                this.$emit('update:modelValue', this.state)
            }
        },
        enableOn(n) {
            return { disabled : this.changedTo < n }
        }
    },
    watch : {
        modelValue(newValue) {
            this.state = newValue || [50,50,50,50,50]
            this.changedTo = newValue ? 5 : 0
        }
    }
};
</script>

<style scoped>
.slider-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow-y: scroll;
    padding-right: 15px;
    width: 100%
}
h2, .input {
    grid-column: 1 / 3;
}
.left {
    grid-column: 1;
    margin-left: 5px;
    font-size: 1.5rem;
}
.right {
    text-align: right;
    grid-column: 2;
    font-size: 1.5rem;
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
.input {
    font-size: 1.5rem;
}
.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>
