const app = Vue.createApp({
    data() {
        return {
            work: {},
            results: {},
            IMG_BASE: "http://localhost/emoticon-data/"
        }
    },
    async mounted() {
        this.id_prefix = 0
        this.work = await (await fetch('gen/affnet/results.json')).json()
        console.log(this.work)
    },
    methods: {
        getParamoji(item) {
            const key = item.url +'_' + item.X_min.toFixed(0) +'_'+ item.Y_min.toFixed(0)
            if (!(key in this.results)) return []
            return  this.getParamojiVec(this.results[key])
        },
        getParamojiVec(vec) {
            return [
                vec.paramoji_v,
                vec.paramoji_a1,
                vec.paramoji_a2,
                vec.paramoji_d,
                vec.paramoji_c,
            ]
        },
        getSVG(x) {
            const id_prefix = this.id_prefix++
            return paramoji_svg(x[0],x[1],x[2],x[3],x[4],"none")
                .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
                .replace(/\(#/g,"(#id-"+id_prefix+"-")
                .replace(/id="/g,"id=\"id-"+id_prefix+"-")

        },
        getDims(item) {
            const dims=["Peace","Affection","Esteem","Anticipation","Engagement","Confidence","Happiness","Pleasure","Excitement","Surprise","Sympathy","Doubt/Confusion","Disconnection","Fatigue","Embarrassment","Yearning","Disapproval","Aversion","Annoyance","Anger","Sensitivity","Sadness","Disquietment","Fear","Pain","Suffering"]
            return dims.filter(dim => item[dim]!='0.0').join(', ')
        }
    }
})
window.onload = () => { app.mount("#app") }