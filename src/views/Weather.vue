<template>
  <div>
    <h4>weather</h4>
    <h4>{{ this.currentWeather }}</h4>
  </div>
</template>

<script>
// import axios from "axios";
import db from "@/firebase/firebaseInit.js";
import { collection, getDocs, query, where } from "firebase/firestore";

export default {
  name: "WeatherView",
  props: ["APIKey"],
  data() {
    return {
      forecast: null,
      currentWeather: null,
      loading: true,
    };
  },

  methods: {
    async getWeather() {
      const q = query(
        collection(db, "latLon"),
        where("city", "==", `${this.$route.params.city}`)
      );

      const querySnap = await getDocs(q);

      querySnap.forEach((doc) => {
        this.currentWeather = doc.data().currentWeather;
        // const lat = doc.data().lat;
        // const lon = doc.data().lon;
      });
    },
  },

  created() {
    this.getWeather();
  },
};
</script>

<style>
h4 {
  padding-top: 100px;
}
</style>