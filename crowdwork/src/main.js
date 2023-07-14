import { createApp } from "vue"
import ErrorDialog from "./ErrorDialog.vue";
import ClassificationView from "./ClassificationView.vue"
import FinishedView from "./FinishedView.vue";
import axios from "axios";

function hashCode(s) {
    return s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);
}

const app = createApp({
    template: '<div>' +
        '<error-dialog v-model:error="error"></error-dialog>' +
        '<classification-view v-if="direction==\'encode\'" :task="task" :group="group"></classification-view>' +
        '<finished-view v-if="direction==\'finished\'" :vcode="vcode"></finished-view>' +
        '</div>',
    data() { return {
        error: "",
        campaignId: "",
        workerId: "",
        taskId: "",
        group: "",
        direction: "",
        task: {},
        vcode: "",
        startTime: Date.now()
    }},
    async created() {
        const getParam = (key, val) => {
            const m=window.location.search.match(new RegExp("[?&]"+key+"=([^&]*)"))
            if (!m) {
                if (val === undefined) { throw new Error("Missing url param " + key) } else return val
            }
            return m[1]
        }
        this.campaignId = getParam("CAMPID");
        this.workerId = getParam("WORKERID");
        this.taskId = getParam("TASKID");
        this.group = ['A','B'][(hashCode(this.workerId) % 2 + 2) % 2]
        this.task = await (fetch(BASE_URL + "/emoticon-data/work.json").then(x => x.json()))
        this.direction = "encode"
    },
    methods: {
        showError(error) {
            this.error = error;
        },
        async saveWork(work) {
            Object.assign(work, {
                campaignId: this.campaignId,
                workerId: this.workerId,
                taskId: this.taskId,
                group: this.group,
                direction: this.direction,
                workName: this.task.id,
                startTime: this.startTime,
            endTime: Date.now()
            })
            this.direction="finished"
            const response = await axios.post(BASE_URL + '/api.php', work)
            this.vcode =  response.data.vcode;
        }
    },
    components: {
        'error-dialog' : ErrorDialog,
        'classification-view': ClassificationView,
        'finished-view': FinishedView,
    }
});
app.mount('#app')

app.config.errorHandler = function (err, vm, info) {
    console.error(err)
    vm.$root.showError(err);
};
