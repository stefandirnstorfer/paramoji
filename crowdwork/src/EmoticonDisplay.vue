<template lang="pug">
.emoticon
    .label(v-if="state.label") {{ state.label }}
    .emoji(v-if="state.code" :style="emoji_style")
    .paramoji(v-if="Array.isArray(state)" v-html="paramoji")
</template>

<script>
let id_prefix=0
export default {
    props: [ 'state', 'color', 'size'],
    computed: {
        paramoji() {
          const param= this.state.map(x => x/100)
          let svg = paramoji_svg(param[0], param[1], param[2], param[3], param[4])
          svg = svg
              .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
              .replace(/\(#/g,"(#id-"+id_prefix+"-")
              .replace(/id="/g,"id=\"id-"+id_prefix+"-")
          id_prefix += 1
          return svg
        },
        emoji_style() {
            const imageUrl= BASE_URL + '/emoticon-data/emoji/emoji_u' + this.state.code.toString(16) + '.png';
            return 'background-image: url('+imageUrl+')';
        }
    }
};
</script>
<style>
    .emoticon {
        width: 100%;
        height: 100%;
        text-align: center;
        display: grid;
        overflow: hidden;
    }
    .emoji {
        width:100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        object-fit: contain;
        place-self: center;
    }
    .paramoji {
        display: grid;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .label {
        margin: auto;
        place-items: center;
        font-size: calc(1rem + 2vh);
        border: 2px solid black;
        padding: 5px 20px 5px 20px;
    }
</style>
