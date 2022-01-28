<template lang="pug">
.emoticon(ref="container" v-html="body()")
</template>

<script>
import * as emo from './emoticon'

var id_prefix= 0

export default {
    props: [ 'state', 'color', 'size'],
    methods: {
        fixids(svg) {
            id_prefix++
            return svg
                .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
                .replace(/\(#/g,"(#id-"+id_prefix+"-")
                .replace(/id="/g,"id=\"id-"+id_prefix+"-")
        },
        body() {
            if (this.state) {
              if (this.state.label)
                return '<div class="label '+ (this.size || '') +'">'
                    + this.state.label + '</div>'
              if (this.state.code)
                return '<img class="emoji" src="' + BASE_URL + '/emoticon-data/emoji/emoji_u' + this.state.code.toString(16) + '.svg"/>';
              if (Array.isArray(this.state)) {
                return this.fixids(emo.paramoji_svg(this.state[0], this.state[1], this.state[2], this.state[3], this.state[4], this.color))
              } else
                return this.fixids(emo.emoticon_svg(
                    this.state.valence,
                    this.state.arousal,
                    this.state.potency,
                    this.state.contempt,
                    this.state.expression, this.color || "gold"
                  ))
            }
        }
    }
};
</script>
<style>
    .emoticon {
        height: 100%;
        overflow : hidden;
        text-align: center;
        display: grid;
    }
    .emoji {
        width: 80%;
        height: 80%;
        object-fit: contain;
        place-items: center;
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
</style>
