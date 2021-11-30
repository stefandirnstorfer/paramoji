import Vue from "vue"
import ClassificationView from "./ClassificationView"
import RecognitionView from "./RecognitionView"
import ErrorDialog from "./ErrorDialog";

Vue.config.productionTip = false;

function hashCode(s) {
    return s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);
}

/* eslint-disable no-new */
new Vue({
    el: "#app",
    template: '<div><error-dialog :error.sync="error"></error-dialog>'+
        '<classification-view v-if="doClassify" :campaignId="campaignId" :workerId="workerId" :taskId="taskId"></classification-view>' +
        '<recognition-view v-if="doRecognize" :campaignId="campaignId" :workerId="workerId" :taskId="taskId"></recognition-view>' +
        '</div>',
    data() { return {
        doClassify: false,
        doRecognize: false,
        error: "",
        campaignId : "",
        workerId : "",
        taskId : "",
        AB : "A"
    }},
    created() {
        const m= window.location.search.match(/^\?CAMPID=(.*)&WORKERID=(.*)&TASKID=(.*)/)
        if (!m || m.length < 4) {
            this.error= "Worker and campain id not found"
        } else {
            this.campaignId = m[1];
            this.workerId = m[2];
            this.taskId = m[3];
            this.AB = hashCode(this.workerId) & 1 ? "A" : "B";
        }
        this.doRecognize= true
    },
    methods: {
        showError(error) {
            this.error = error;
        }
    },
    components: {
        'classification-view' : ClassificationView,
        'error-dialog' : ErrorDialog
    },
});

Vue.config.errorHandler = function (err, vm, info) {
    vm.$root.showError(err);
};
