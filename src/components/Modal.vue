<template>
  <div @click="closeModal" class="modal" ref="modal">
    <div class="modal-wrap" ref="modalWrap">
      <label for="city-name">Enter Location: </label>
      <input
        v-model="city"
        type="text"
        name="city-name"
        placeholder=" City Name"
      />

      <button @click="addCity">Add</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import db from "@/firebase/firebaseInit.js";
import { collection, addDoc } from "firebase/firestore";

export default {
  props: ["APIKey"],
  name: "ModalComp",
  data() {
    return {
      city: [],
    };
  },

  methods: {
    closeModal(e) {
      if (e.target === this.$refs.modal) this.$emit("closeModal");
    },

    async addCity() {
      if (this.city === "") {
        alert("Field cannot be empty");
      } else {
        const getLatLon = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=5&appid=${this.APIKey}`
        );

        console.log("getLatLon", getLatLon);

        const latLonData = await getLatLon.data;
        const lat = latLonData[0].lat;
        const lon = latLonData[0].lon;

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.APIKey}`
        );

        console.log("response", response);

        const data = await response.data;

        const citiesCollection = collection(db, "latLon");

        await addDoc(citiesCollection, {
          city: this.city,
          currentWeather: data,
          lat: lat,
          lon: lon,
        }).then(() => {
          this.$emit("closeModal");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  z-index: 101;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  label {
    color: #fff;
  }

  .modal-wrap {
    max-width: 500px;
    border-radius: 8px;
    width: 80%;
    padding: 20px;
    background-color: #31363d;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    input {
      color: #fff;
      border: none;
      background-color: transparent;
      border-bottom: 1px solid #fff;
      padding: 6px 4px;
      margin: 10px 0 20px;
      width: 100%;
      &:focus {
        outline: none;
      }
    }

    button {
      background-color: #222325;
      color: #fff;
      padding: 6px 20px;
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>