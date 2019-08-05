<template>
  <t-modal
    ref="modal"
    closeIconClass="text-gray-300 w-8 right-0 mt-2 mr-6 absolute"
    @closed="$emit('close')"
  >
    <slot />
  </t-modal>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    '$props.show': function (newValue) {
      if (newValue) {
        this.$refs.modal.show();
      } else {
        this.$refs.modal.hide();
      }
    },
  }
}
</script>
