import { createApp } from "vue"
import ErrorDialog from "./ErrorDialog.vue";

function hashCode(s) {
    return s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);
}

import ClassificationView from "./ClassificationView"

const app = createApp({
    template: '<div>' +
        '<error-dialog v-model:error="error"></error-dialog>'+
        '<classification-view :campaignId="campaignId" :workerId="workerId" :taskId="taskId"></classification-view>' +
        //'<recognition-view v-if="doRecognize" :campaignId="campaignId" :workerId="workerId" :taskId="taskId"></recognition-view>' +
        '</div>',
    data() { return {
        error: "",
        doClassify: true ,
        doRecognize: false,
        campaignId: "",
        workerId: "",
        taskId: "",
        AB: "A"
    }},
    created() {
        const m = window.location.search.match(/^\?CAMPID=(.*)&WORKERID=(.*)&TASKID=(.*)/)
        if (!m || m.length < 4) {
            this.error = "Worker and campain id not found"
        } else {
            this.campaignId = m[1];
            this.workerId = m[2];
            this.taskId = m[3];
            this.AB = hashCode(this.workerId) & 1 ? "A" : "B";
        }
        this.doRecognize = true
    },
    methods: {
        showError(error) {
            this.error = error;
        }
    },
    components: {
        'error-dialog' : ErrorDialog,
        'classification-view': ClassificationView,
    }
});
app.mount('#app')

app.config.errorHandler = function (err, vm, info) {
    vm.$root.showError(err);
};
