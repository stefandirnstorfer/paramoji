const app = Vue.createApp({
    data() {
        return {
            state: {
                v: 50,
                a1: 50,
                a2: 50,
                d: 50,
                c: 0
            },
            vstate: {
                a: 50,
                o: 50
            },
            a2state: {
                a: 50
            },
            fix: {
                v: false,
                a1: false,
                a2: false,
                d: false,
                c: false
            },
            blink: false,
            model: "ao",
            animate: false,
            animateBlink: false,
            oldtime: 0,
            speed: 50,
        }
    },
    created() {
        const newState = {}
        for (let key in this.state) {
            var m= location.search.match(RegExp(key + "=([0-9]+)"));
            newState[key]= m ? parseInt(m[1]) : this.state[key];
        }
        this.state = newState
        this.doBlink();
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
        doBlink() {
            if (this.animateBlink) {
                this.blink = true
                setTimeout(() => {
                    this.blink = false
                    const delay = -4e3 * Math.log(Math.random())
                    setTimeout(() => {
                        this.blink = this.animateBlink;
                            this.doBlink()
                    }, delay)
                }, 100)
            }
        },
        runAnimation(dstate) {
            if (!this.animate) return;
            const now = new Date().getTime();
            if (!dstate) {
                this.oldtime = now;
                dstate = {v:0, a1:0, a2:0, d:0, c:0}
            }
            let speed = this.speed;
            let dt = (now - this.oldtime) * speed / 200;
            if (dt > 1) {
                this.oldtime = now;
                var decay = 0.05;
                for (var key in this.state) {
                    if (this.fix[key]) continue;
                    let x = parseFloat(this.state[key]);
                    let dx = dstate[key] || 0;
                    dx = decay * (Math.random() - .5) * Math.sqrt(dt) + (1 - decay) * dx;
                    x = x + dx * dt;
                    if (x > 100) {
                        x = 100;
                        dx = 0;
                    }
                    if (x < 0) {
                        x = 0;
                        if (!["c"].includes(key)) {
                            dx = 0;
                        }
                    }
                    this.state[key] = x;
                    dstate[key] = dx;
                }
            }
            window.requestAnimationFrame(() => {
                this.runAnimation(dstate);
            })
        },
        updateVState() {
            const o = parseFloat(this.vstate.o)
            const a = parseFloat(this.vstate.a)
            this.state.a1 = Math.max(0, Math.min(100, a + (o-50)))
            this.state.a2 = Math.max(0, Math.min(100, a - (o-50)))
        },
        updateA2State() {
            const a2 = parseFloat(this.a2state.a)
            this.state.a1 = a2 * a2 * (100-a2) / 1500
            this.state.a2 = a2 * a2 / 100
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
                this.a2state.a = 100* Math.sqrt(parseFloat(this.state.a2)/100)
                if (this.updateUrlTimer) clearTimeout(this.updateUrlTimer)
                let query= ["V","A1","A2","D","C"].map(x => x.toLowerCase()+'='+this[x])
                this.updateUrlTimer = setTimeout(() => {
                    window.history.replaceState({}, "Emoticons", "?" + query.join("&"))
                }, 100)
            }
        },
    },
    computed: {
        "V"() { return parseInt(this.state.v).toFixed(0) },
        "A1"() { return parseInt(this.state.a1).toFixed(0) },
        "A2"() { return parseInt(this.state.a2).toFixed(0) },
        "D"() { return parseInt(this.state.d).toFixed(0) },
        "C"() { return parseInt(this.state.c).toFixed(0) },
        "O"() { return parseInt(this.vstate.o).toFixed(0) },
        "A"() { return parseInt(this.vstate.a).toFixed(0) },
        "Asup2"() { return parseInt(this.a2state.a).toFixed(0) }
    }
})
window.onload = () => { app.mount("#app") }
