const app = Vue.createApp({
    data() {
        return {
            faces: [],
            resultA: {},
            resultB: {},
            IMG_BASE: "http://localhost/emoticon-data/"
        }
    },
    async mounted() {
        this.resultA = await (await fetch('gen/resultA.json')).json()
        this.resultB = await (await fetch('gen/resultB.json')).json()
        for (face in this.resultA) {
            this.faces.push(face)
        }
        this.id_prefix = 0
    },
    methods: {
        getSVG(x) {
            const id_prefix = this.id_prefix++
            return paramoji_svg(x[0],x[1],x[2],x[3],x[4],"gold")
                .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
                .replace(/\(#/g,"(#id-"+id_prefix+"-")
                .replace(/id="/g,"id=\"id-"+id_prefix+"-")

        },
        getEmojiCode(face) {
            const x=this.resultB[face].x_opt
            const y=this.resultA[face].x_opt
            let code="", best=0
            for (let key in y) {
                if (y[key] > best) {
                    best = y[key]
                    code = key
                }
            }

            return [
                Math.round(100*x[0]),
                Math.round(50*(x[1]+x[2])),
                Math.round(100* x[3]),
                Math.round(100*x[4]),
                Math.round(50*(x[2]-x[1]) + 50)
            ].join(',') + '\n' + code
        }
    }
})
window.onload = () => { app.mount("#app") }