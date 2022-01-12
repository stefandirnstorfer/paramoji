import { createApp } from "vue"
import ErrorDialog from "./ErrorDialog.vue";
import ClassificationView from "./ClassificationView.vue"
import RecognitionView from "./RecognitionView.vue";
import axios from "axios";

function hashCode(s) {
    return s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);
}


const app = createApp({
    template: '<div>' +
        '<error-dialog v-model:error="error"></error-dialog>'+
        '<classification-view v-if="doClassify" :task="task" :ab="AB"></classification-view>' +
        '<recognition-view v-if="doRecognize" :task="task" :ab="AB"></recognition-view>' +
        '</div>',
    data() { return {
        error: "",
        doClassify: false,
        doRecognize: false,
        campaignId: "",
        workerId: "",
        taskId: "",
        task: {},
        AB: "A",
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
            this.AB = hashCode(this.workerId) & 1 ? "A" : "B";
            this.task = await (fetch(BASE_URL + "/emoticon-data/work.json").then(x => x.json()))
            this.doRecognize = this.task.type == "recognize"
            this.doClassify = this.task.type == "classify"
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
                work_id: this.task.id,
                ab: this.AB,
                task: this.task.type,
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
        'recognition-view': RecognitionView
    }
});
app.mount('#app')

app.config.errorHandler = function (err, vm, info) {
    vm.$root.showError(err);
};
