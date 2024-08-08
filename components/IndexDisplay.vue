<template>
  <span>{{ index }}</span>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped></style>
