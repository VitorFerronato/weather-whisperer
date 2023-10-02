<template>
  <div class="grid">
    <div v-for="(city, index) in cities" :key="index" class="city-link">
      <City :city="city" :edit="edit" />
    </div>
  </div>
</template>

<script>
import City from "@/components/City.vue";
// @ is an alias to /src
export default {
  components: { City },
  name: "AddCity",
  props: ["cities", "edit"],
};
</script>
<style lang="scss" scoped>
.grid {
  display: grid;
  padding-top: 81px;
  background-color: #31363d;
  width: 100%;
  min-height: 100vh;
  grid-auto-rows: 250px;
  @media (min-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
