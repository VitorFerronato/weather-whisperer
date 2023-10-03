<template>
  <div class="main">
    <div v-if="loading" class="loading">
      <span></span>
    </div>

    <div v-else class="weather" :class="{ day: isDay, night: isNight }">
      <div class="weather-wrap">
        <Current-weather
          :isDay="isDay"
          :isNight="isNight"
          :currentWeather="currentWeather"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import CurrentWeather from "@/components/CurrentWeather.vue";
import db from "@/firebase/firebaseInit.js";
import { collection, getDocs, query, where } from "firebase/firestore";

export default {
  components: { CurrentWeather },
  name: "WeatherView",
  props: ["APIKey", "isDay", "isNight"],
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

      this.loading = false;
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

<style lang="scss" scoped>
.loading {
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }

  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  span {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 2px solid transparent;
    border-top-color: #142a5f;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
  }
}

.weather {
  transition: 500ms ease;
  overflow: scroll;
  width: 100%;
  height: 100%;

  .weather-app {
    overflow: hidden;
    max-width: 1024px;
    margin: 0 auto;
  }
}
</style>