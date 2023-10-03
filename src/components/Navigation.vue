<template>
  <div>
    <header v-if="addCityActive" class="container add-city">
      <nav>
        <span>Add City</span>
        <div class="right">
          <i @click="toggleEdit" ref="editCities" class="far fa-edit"></i>
          <i @click="reloadApp" class="fas fa-sync"></i>
          <i @click="addCity" class="fas fa-plus"></i>
        </div>
      </nav>
    </header>

    <header class="container" :class="{ day: isDay, night: isNight }" v-else>
      <nav>
        <router-link :to="{ name: 'AddCity' }" class="router-link">
          <i class="fas fa-plus"></i>
        </router-link>
        <span>
          {{ new Date().toLocaleString("en-us", { weekday: "short" }) }},
          {{ new Date().toLocaleString("en-us", { month: "short" }) }},
          {{ new Date().toLocaleString("en-us", { day: "2-digit" }) }},
        </span>

        <span> &deg; F </span>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  name: "NavigationComp",
  props: ["addCityActive", "isDay", "isNight"],
  data() {
    return {};
  },
  methods: {
    addCity() {
      this.$emit("openModal");
    },
    reloadApp() {
      location.reload();
    },
    toggleEdit() {
      this.$refs.editCities.classList.toggle("edit-active");
      this.$emit("toggleEdit");
    },
  },
};
</script>

<style lang="scss" scoped>
.add-city {
  background-color: #313640;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}



header {
  z-index: 99;
  position: fixed;
  max-width: 1024px;
  width: 100%;


  nav {
    display: flex;
    color: #fff;
    padding: 30px 0;
    justify-content: space-between;
    .edit-active {
      color: rgba(210, 75, 75, 1);
    }

    .router-link {
      color: #fff;
    }

    .right {
      i {
        font-size: 20px;
      }

      i:nth-child(2),
      i:nth-child(3) {
        margin-left: 16px;
      }
    }
  }

  span {
    font-weight: 600;
  }
}
</style>
