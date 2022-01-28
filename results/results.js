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
        this.work = await (await fetch('gen/emotic/work.json')).json()
        results_list = await (await fetch('gen/emotic/results.json')).json()
        for (let item of results_list)
            this.results[item.Crop_name]=item
    },
    methods: {
        getParamoji(crop_name) {
            return  [
                this.results[crop_name].paramoji_v,
                this.results[crop_name].paramoji_a1,
                this.results[crop_name].paramoji_a2,
                this.results[crop_name].paramoji_p,
                this.results[crop_name].paramoji_c,
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