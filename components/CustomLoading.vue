<template>
  <div class="ma-10">
    <v-progress-circular
      :size="size"
      :width="width"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  props: {
    size: '80',
    width: '8',
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
