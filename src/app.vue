<template>
  <div class="my-app">
    <h3>{{ title }}</h3>
    <diy-cmp :name="name"></diy-cmp>
  </div>
</template>
<script>
import DiyCmp from './DiyCmp'

export default {
  components: {
    DiyCmp
  },
  data() {
    return {
      title: 'A demo of Vue server-side-render.',
      name: 'Deguang'
    }
  },
  created() {
    console.log("app component created.");
  }
}
</script>
<style scoped>
  h3 {
    color: #45b6a4;
  }
</style>


