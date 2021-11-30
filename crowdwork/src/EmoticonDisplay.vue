<template lang="pug">
    .emoticon(ref="container") X
</template>

<script>
import * as emo from './emoticon'

var id_prefix= 0

export default {
    props: [ 'state' ],
    mounted() {
        this.redraw()
    },
    methods: {
        fixids(svg) {
            id_prefix++
            if (!this.idexp) {
                let re = /id="([^"]+)"/g;
                let ids = [];
                let m;
                while (m = re.exec(svg)) ids.push(m[1]);
                this.idexp= re.compile(ids.join('|'),"g")
            }
            return svg.replace(this.idexp, id => id_prefix+"_"+id);
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
                        this.state.expression
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
