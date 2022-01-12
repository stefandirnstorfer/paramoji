<template lang='pug'>
.modal.show(v-if="error")
    .modal-dialog.modal-dialog-centered
        .modal-content
            .modal-header
                h4.modal-title {{ header(error) }}
                button.close(@click="close") &times
            .modal-body
                .alert.alert-danger {{ format(error) }}
            .modal-footer
                button.btn.btn-danger(@click="close()") Close
    .modal-backdrop.show(style="z-index:-1" @click="close")
</template>

<script>
    export default {
        props: ['error'],
        methods: {
            close() {
                this.$emit('update:error', null)
            },
            header(error) {
                if (error.response && error.response.data) return "Server error"
                if (error.message) return error.message
                return "Error"
            },
            format(error) {
                if (error.response && error.response.data) {
                    var errorData= error.response.data
                    if (errorData.message) return errorData.message
                }
                if (error.config && error.config.url) {
                    return "Error accessing "+error.config.url
                }
                if (error.message) return error.message
                return error.toString()
            }
        },
        watch: {
            "error"(value) {
                document.getElementsByTagName('body')[0].setAttribute("class", value ? "dialog-open" : "")
            }
        }
    }
</script>

<style lang="css">
    .show { display: block !important }
</style>
