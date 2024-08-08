<!-- components/CustomSearch.vue -->

<template>
  <v-text-field
    v-model="searchQuery"
    :label="label"
    :dense="dense"
    :placeholder="placeholder"
    outlined
    style=""
  ></v-text-field>
</template>

<script>
export default {
  props: {
    label: String,          // Label for the search field
    dense: Boolean,         // Whether to use dense mode
    placeholder: String     // Placeholder text for the search field
  },
  data() {
    return {
      searchQuery: ''       // Data to store the search query
    };
  }
};
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
