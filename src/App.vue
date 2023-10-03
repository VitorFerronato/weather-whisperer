<template>
  <div class="main">
    <Modal
      v-if="modalOpen"
      @closeModal="modalOpen = !modalOpen"
      @setNewCity="newAdd = $event"
      :APIKey="APIKey"
    />
    <Navigation
      @openModal="modalOpen = !modalOpen"
      @toggleEdit="edit = !edit"
      :addCityActive="addCityActive"
      :isDay="isDay"
      :isNight="isNight"
    />
    <router-view
      :cities="cities"
      :edit="edit"
      :APIKey="APIKey"
      @is-day="isDay = !isDay"
      @is-night="isNight = !isNight"
      @resetDays="resetDays"
    />
  </div>
</template>

<script>
import axios from "axios";
import db from "@/firebase/firebaseInit.js";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import Navigation from "./components/Navigation.vue";
import Modal from "./components/Modal.vue";

export default {
  name: "App",
  components: { Navigation, Modal },
  data() {
    return {
      APIKey: "af5906b85436dc10c0b8e86246901447",
      cities: [],
      modalOpen: false,
      isLoading: false,
      newAdd: false,
      edit: false,
      addCityActive: false,
      isDay: null,
      isNight: null,
    };
  },

  watch: {
    $route() {
      this.checkRoute();
    },
  },
  methods: {
    async getCurrentWeather() {
      this.isLoading = true;
      const citiesCollection = collection(db, "latLon");

      onSnapshot(citiesCollection, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            try {
              const lat = change.doc.data().lat;
              const lon = change.doc.data().lon;

              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.APIKey}`
              );

              const data = response.data;

              const getCurrentCityRef = doc(db, "latLon", change.doc.id);

              await updateDoc(getCurrentCityRef, {
                currentWeather: data,
              }).then(() => {
                this.cities.push(change.doc.data());
              });
            } catch (error) {
              console.log(error);
            }
          }

          if (change.type === "removed") {
            this.cities = this.cities.filter((city) => {
              return city.city !== change.doc.data().city;
            });
          }
        });
      });

      this.isLoading = false;
    },
    checkRoute() {
      if (this.$route.name === "AddCity") this.addCityActive = true;
      else this.addCityActive = false;
    },
    resetDays() {
      this.isDay = false;
      this.isNight = false;
    },
  },

  created() {
    this.getCurrentWeather();
    this.checkRoute();
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

.main {
  max-width: 1024px;
  margin: 0 auto;
  height: 100vh;

  .container {
    padding: 0 20px;
  }
}
</style>
