<template lang="pug">
    .emoticon(ref="container") X
</template>

<script>
import * as emo from './emoticon'

var id_prefix= 0

export default {
    props: [ 'state', 'color' ],
    mounted() {
        this.redraw()
    },
    methods: {
        fixids(svg) {
            id_prefix++
            return svg
                .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
                .replace(/\(#/g,"(#id-"+id_prefix+"-")
                .replace(/id="/g,"id=\"id-"+id_prefix+"-")
        },
        redraw() {
            if (this.state) {
                if (this.state.code)
                    this.$el.innerHTML= '<img class="emoji" src="'+BASE_URL+'/emoticon-data/emoji/emoji_u' + this.state.code.toString(16) + '.svg"/>';
                else
                    this.$el.innerHTML= this.fixids(emo.emoticon_svg(
                        this.state.valence,
                        this.state.arousal,
                        this.state.potency,
                        this.state.contempt,
                        this.state.expression, this.color || "gold"
                    ))
            }
        }
    },
    watch : {
        "state" : {
            handler() { this.redraw() },
            deep: true
        }
    }
};
</script>
<style>
    .emoticon {
        height: 100%;
        overflow : hidden;
        text-align: center;
    }
    .emoji {
        width: 80%;
        height: 80%;
        object-fit: contain;
    }
</style>
