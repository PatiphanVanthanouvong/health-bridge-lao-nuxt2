<template>
  <div>
    <v-btn @click="goBack">Go Back</v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>
