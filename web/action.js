import { paramoji_blink_svg, dark_mode } from "./paramoji.js"
import { schematic_svg } from "./schematic.js"

const app = Vue.createApp({
    data() {
        return {
            state: {},
            vstate: {},
            estate: {},
            blink: false,
            model: "ao", // a1a2, ao, e
            style: this.getDefaultStyle()
        }
    },
    created() {
        const newState = this.neutralState(this.model)
        for (let key in newState) {
            var m= location.search.match(RegExp(key + "=([-0-9]+)"));
            if (m) newState[key]= parseFloat(m[1]);
        }
        console.log("created", newState)
        this.state = newState
    },
    methods: {
        getDefaultStyle() {
            // Check if user prefers dark mode
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "comic-dark";
            }
            return "comic";
        },
        paramoji() {
            const v= this.state.v/100,
                a1= this.state.a1/100,
                a2= this.state.a2/100,
                d= this.state.d/100,
                c= this.state.c/100,
                g= this.state.g/100,
                b= this.state.b/100,
                t= this.state.t/100;
            if (this.style=='schematic')
                return schematic_svg(v, a1, a2, d,c)
            let svg= paramoji_blink_svg(this.blink, v, a1, a2, d, g, c, b, t)
            if (this.lightdark=='dark')
                svg = dark_mode(svg)
            return svg
        },
        neutralState(model) {
            return {
                v: model ? 55 : 50,
                a1: model ? 47 : 50,
                a2: model ? 17 : 50,
                d: 50,
                c: model == "e" ? 25 : 0,
                g: 0,
                b: 0,
                t: 0
            }
        },
        animateTo(newState) {
            newState= Object.assign({}, this.state, newState)
            const states = [];
            for (let t=0; t<=24; t++) {
                let tstate= {}
                for (let key in this.state) {
                    tstate[key] = t/24*newState[key] + (1-t/24)*this.state[key]
                }
                states.push(tstate)
            }
            const update = () => {
                if (states.length) {
                    this.state = states.shift()
                    requestAnimationFrame(update)
                }
                this.updateOther(true)
            }
            update()
            this.state= newState
        },
        random() {
            const newState= {}
            for (let key in this.state) {
                newState[key] = Math.min(100, Math.max(0, Math.random()*120 - 10))
            }
            newState.c = newState.c * newState.c /100
            newState.g *= Math.pow(Math.random(),1)
            newState.b *= Math.pow(Math.random(),2)
            newState.t *= Math.pow(Math.random(),3)
            this.animateTo(newState)
        },
        updateVState(newVState) {
            const vstate = Object.assign({}, this.vstate, newVState)
            const o = parseFloat(vstate.o)/100
            const a = parseFloat(vstate.a)
            const newState = Object.assign({}, this.state, {
                a1: o<0.5 ? Math.min(100, 2 * a * o) : Math.max(0, a + 50 - (1-o) * 100),
                a2: o>0.5 ? Math.min(100, 2 * a * (1-o)) : Math.max(0, a + 50 - o * 100),
            })
            if (newVState) {
                this.animateTo(newState)
            } else {
                this.state=newState
            }
        },
        updateEState(newEState) {
            const estate= Object.assign({}, this.estate, newEState)
            const dotprod = (a,b,c,d,e,f) => a * estate.v + b * estate.d + c * estate.o + d * estate.a + e * estate.c + f
            const newState = Object.assign({}, this.state, {
                v: dotprod(+1.00, +0.32, -0.25, -0.24, +0.22,   3),
                a1: Math.max(0, dotprod(+0.13, +0.18, +0.44, +1.00, +0.48, -50)),
                a2: Math.max(0, dotprod(-0.11, -0.13, -1.00, +0.55, +0.07,  83)),
                d: dotprod(-0.39, +1.00, -0.14, -0.07, -0.04,  31),
                c: Math.min(110, dotprod(-0.29, -0.10, -0.09, -0.47, +1.00,  48))
            })
            if (newEState) {
                this.animateTo(newState)
            } else {
                this.state=newState
            }
        },
        fmt(x) { return parseFloat(x).toFixed(0) },
        updateUrl() {
            clearTimeout(this.updateUrlTimer)
            const neutral = this.neutralState(null)
            let query= Object.keys(neutral)
                .filter(x => this.state[x]!=neutral[x])
                .map(x => x+'='+this.fmt(this.state[x]))
                .join("&")
            this.updateUrlTimer = setTimeout(() => {
                window.history.replaceState({}, "Emoticons", "?" + query)
            }, 100)
        },
        updateOther(force) {
            const a1= parseFloat(this.state.a1)/100, a2= parseFloat(this.state.a2)/100
            if (!this.vstate.a || force) this.vstate.a = 50*(a1+a2)
            if (!this.vstate.o || force) this.vstate.o = (a1 - a2) *50 + 50
            const dotprod = (a,b,c,d,e) => a*(this.state.v-3) + b*(this.state.a1*1+50) + c*(this.state.a2-83) + d*(this.state.d-31) + e*(this.state.c-48)
            const tryfix = (a,b) => !force && Math.abs(a-b) < 2 ? a : b
            this.estate.v = tryfix(this.estate.v, dotprod(0.79,  0.10, -0.09, -0.30, -0.23))
            this.estate.d = tryfix(this.estate.d, dotprod(0.28,  0.15, -0.11,  0.86, -0.09))
            this.estate.o = tryfix(this.estate.o, dotprod(-0.20, 0.34, -0.78, -0.11, -0.07))
            this.estate.a = tryfix(this.estate.a, dotprod(-0.15, 0.63,  0.35, -0.05, -0.30))
            this.estate.c = tryfix(this.estate.c, dotprod(0.17,  0.37,  0.05, -0.03, 0.78))
            this.updateUrl()
        }
    },
    computed: {
        lightdark() { return this.style.includes('dark') ? 'dark' : 'light' },
    },
    watch: {
        animate(value, oldValue) {
            if (value && !oldValue) this.runAnimation()
        },
        state: {
            deep: true,
            handler() { this.updateOther(false) }
        },
    }
})
window.onload = () => { app.mount("#app") }
