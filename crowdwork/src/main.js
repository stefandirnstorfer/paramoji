import { createApp } from "vue"
import ErrorDialog from "./ErrorDialog.vue";
import ClassificationView from "./ClassificationView.vue"
import axios from "axios";

function hashCode(s) {
    return s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);
}


const app = createApp({
    template: '<div>' +
        '<error-dialog v-model:error="error"></error-dialog>'+
        '<classification-view v-if="task.id" :task="task"></classification-view>' +
        '</div>',
    data() { return {
        error: "",
        campaignId: "",
        workerId: "",
        taskId: "",
        task: {},
        startTime: Date.now()
    }},
    async created() {
        const m = window.location.search.match(/^\?CAMPID=(.*)&WORKERID=(.*)&TASKID=(.*)/)
        if (!m || m.length < 4) {
            this.error = "Worker and campaign id not found"
        } else {
            this.campaignId = m[1];
            this.workerId = m[2];
            this.taskId = m[3];
            this.task = await (fetch(BASE_URL + "/emoticon-data/work-fec.json").then(x => x.json()))
        }
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
                workName: this.task.id,
                startTime: this.startTime,
                endTime: Date.now()
            })
            const response = await axios.post(BASE_URL + '/api', work)
            return response.data.code;
        }
    },
    components: {
        'error-dialog' : ErrorDialog,
        'classification-view': ClassificationView,
    }
});
app.mount('#app')

app.config.errorHandler = function (err, vm, info) {
    console.error(err)
    vm.$root.showError(err);
};
