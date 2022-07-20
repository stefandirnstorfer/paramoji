<template lang="pug">
.emoticon.topleft(:style="style")
    div(v-if="state.label") {{ state.label }}
</template>

<script>

export default {
    props: [ 'state', 'color', 'size'],
    computed: {
        imageUrl() {
          if (this.state.code) {
            return BASE_URL + '/emoticon-data/emoji/emoji_u' + this.state.code.toString(16);
          } else {
            const f = i => (100 * this.state[i]).toFixed(0);
            return 'https://paramoji.org/paramoji.svg.php?' +
                'v=' + f(0) + '&a1=' + f(1) + '&a2=' + f(2) + '&d=' + f(3) + '&c=' + f(4)
          }
        },
        style() {
            return 'background-image: url('+this.imageUrl+')';
        }
    }
};
</script>
<style>
    .emoticon {
        width: 100%;
        height: 100%;
        text-align: center;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
    .emoji {
        object-fit: contain;
        place-self: center;
    }
    .label {
        margin: auto;
        place-items: center;
        font-size: 4rem;
        border: 2px solid black;
        padding: 5px 20px 5px 20px;
    }
    .label.small {
        font-size: 1rem;
    }
    .topleft {
        grid-column: 1;
        grid-row: 1;
    }
</style>
