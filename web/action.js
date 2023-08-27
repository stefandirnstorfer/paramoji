const app = Vue.createApp({
    data() {
        return {
            state: {
                v: 50,
                a1: 50,
                a2: 50,
                d: 50,
                c: 25
            },
            vstate: {
                a: 50,
                o: 50
            },
            estate: {
                v: 50,
                d: 50,
                o: 50,
                a: 50,
                c: 25
            },
            blink: false,
            model: "ao"
        }
    },
    created() {
        const newState = {}
        for (let key in this.state) {
            var m= location.search.match(RegExp(key + "=([0-9]+)"));
            newState[key]= m ? parseInt(m[1]) : this.state[key];
        }
        this.state = newState
    },
    methods: {
        paramoji() {
            const v=this.state.v/100,
                a1=this.state.a1/100,
                a2=this.state.a2/100,
                d=this.state.d/100,
                c=this.state.c/100
            return (this.blink ? paramoji_blink_svg : paramoji_svg)(v, a1, a2, d, c)
        },
        random() {
            let newState= {}
            for (let key in this.state) {
                newState[key] = Math.random()*100
            }
            newState.c = newState.c * newState.c /100
            const states = [];
            for (let t=0; t<=1.0; t += 1/24) {
                let tstate= {}
                for (let key in this.state) {
                    tstate[key] = t*newState[key] + (1-t)*this.state[key]
                }
                states.push(tstate)
            }
            const update = () => {
                if (states.length) {
                    this.state = states.shift()
                    requestAnimationFrame(update)
                }
            }
            update()
            this.state= newState
        },
        updateVState() {
            const o = parseFloat(this.vstate.o)
            const a = parseFloat(this.vstate.a)
            this.state.a1 = Math.max(0, Math.min(100, a + (o-50)))
            this.state.a2 = Math.max(0, Math.min(100, a - (o-50)))
        },
        updateEState() {
            const dotprod = (a,b,c,d,e,f) => a * this.estate.v + b * this.estate.d + c * this.estate.o + d * this.estate.a + e * this.estate.c + f
            this.state.v = dotprod(+1.00, +0.32, -0.25, -0.24, +0.22,   3)
            this.state.a1= dotprod(+0.13, +0.18, +0.44, +1.00, +0.48, -50)
            this.state.a2= dotprod(-0.11, -0.13, -1.00, +0.55, +0.07,  83)
            this.state.d = dotprod(-0.39, +1.00, -0.14, -0.07, -0.04,  31)
            this.state.c = dotprod(-0.29, -0.10, -0.09, -0.47, +1.00,  48)
        },
        fmt(x) { return parseFloat(x).toFixed(0) },
        updateUrl() {
            clearTimeout(this.updateUrlTimer)
            let query= ["v","a1","a2","d","c"].map(x => x+'='+this.fmt(this.state[x]))
            this.updateUrlTimer = setTimeout(() => {
                window.history.replaceState({}, "Emoticons", "?" + query.join("&"))
            }, 100)
        }
    },
    watch: {
        animate(value, oldValue) {
            if (value && !oldValue) this.runAnimation()
        },
        animateBlink() { this.doBlink() },
        state: {
            deep: true,
            handler() {
                this.vstate.a = (parseFloat(this.state.a1) + parseFloat(this.state.a2))/2
                this.vstate.o = (parseFloat(this.state.a1) - parseFloat(this.state.a2))/2 + 50
                const dotprod = (a,b,c,d,e) => a*(this.state.v-3) + b*(this.state.a1+50) + c*(this.state.a2-83) + d*(this.state.d-31) + e*(this.state.c-48)
                const tryfix = (a,b) => Math.abs(a-b) < 2 ? a : b
                this.estate.v = tryfix(this.estate.v, dotprod(0.79,  0.10, -0.09, -0.30, -0.23))
                this.estate.d = tryfix(this.estate.d, dotprod(0.28,  0.15, -0.11,  0.86, -0.09))
                this.estate.o = tryfix(this.estate.o, dotprod(-0.20, 0.34, -0.78, -0.11, -0.07))
                this.estate.a = tryfix(this.estate.a, dotprod(-0.15, 0.63,  0.35, -0.05, -0.30))
                this.estate.c = tryfix(this.estate.c, dotprod(0.17,  0.37,  0.05, -0.03, 0.78))
                this.updateUrl()
            }
        },
    }
})
window.onload = () => { app.mount("#app") }
