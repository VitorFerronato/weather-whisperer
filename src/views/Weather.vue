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
      currentTime: false,
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
      });

      this.getCurrentTime();
    },

    getCurrentTime() {
      const dateObjetct = new Date();
      this.currentTime = dateObjetct.getHours();

      const sunrise = new Date(
        this.currentWeather.sys.sunrise * 1000
      ).getHours();

      const sunset = new Date(this.currentWeather.sys.sunset * 1000).getHours();

      if (this.currentTime > sunrise && this.currentTime < sunset) {
        this.$emit("is-day");
        console.log("dia");
      } else {
        this.$emit("is-night");
        console.log("noite");
      }
    },
  },

  created() {
    this.getWeather();
  },
  beforeDestroy() {
    this.$emit("resetDays");
  },
};
</script>

<style>
h4 {
  padding-top: 100px;
}
</style>