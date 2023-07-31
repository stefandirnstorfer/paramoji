<template lang="pug">
.choice-group
    button.btn(:class="{'btn-primary': modelValue===-1}" @click="set(-1)") More {{ a }}
    button.btn(:class="{'btn-primary': modelValue===0}" @click="set(0)") Equal
    button.btn(:class="{'btn-primary': modelValue===1}" @click="set(1)") More {{ b }}
</template>

<script>
export default {
    props: [ 'modelValue', 'a', 'b' ],
    components: {
    },
    data() {
        return {
            state: this.modelValue,
        }
    },
    methods: {
        set(n) {
            this.$emit('update:modelValue', n)
        }
    }
};
</script>

<style scoped>
.btn {
    border: 1px solid blue;
    margin: 2px;
}
</style>
