<template lang="pug">
.root()
    h2.title Complete
    .card.big-view
        .card-header.bg-primary.text-white Thank you for completing your task. This is your vcode:
        .card-body.display-4.mwcode {{ vcode || workConfirmation }}
</template>

<script>
export default {
    props: ['vcode'],
    data() {
        return {
            workConfirmation: "Waiting for server",
        }
    },
};
</script>

<style scoped>
.root {
    margin: 2em;
}
.mwcode {
  overflow-wrap: anywhere
}
</style>
