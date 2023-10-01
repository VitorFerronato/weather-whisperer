<template>
  <div class="main">
    <Navigation class="navigation" />
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
import db from "@/firebase/firebaseInit.js";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import Navigation from "./components/Navigation.vue";

export default {
  name: "App",
  components: { Navigation },
  data() {
    return {
      APIKey: "af5906b85436dc10c0b8e86246901447",
      cities: [],
    };
  },
  methods: {
    async getCitys() {
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
        });
      });
    },

    getCurrentWeather() {
      axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`
      );
    },
  },

  created() {
    this.getCitys();
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
  height: 100vh;
  .navigation {
    z-index: 99;
    position: fixed;
    max-width: 1024px;
    width: 100%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .container{
    padding: 0 20px;
  }
}
</style>
