<template>
  <application-content
    class="map-view-container"
    :leftSideNavOpen="sideNav.open"
  >
    <split-pane horizontal watch-slots>
      <google-map>
        <template slot-scope="{ google, map }">
          <map-polygon
            v-for="polygon in visiblePolygons"
            :key="polygon.id"
            :paths="polygon.points"
            :google="google"
            :map="map"
            :options="{
             id: polygon.id,
             strokeColor: getStatePolygonColor(polygon.id),
             fillColor: getStatePolygonColor(polygon.id),
            }"
            @click="showInfoWindow"
          />

          <info-window
            :google="google"
            :map="map"
            :visible="infoWindow.visible"
            :position="infoWindow.position"
            @closed="infoWindowClosed"
          >
            <template v-if="selectedPolygon">
              <div slot="title">{{ selectedPolygon.id.toUpperCase() }}</div>
              <div>
                You clicked on the {{ selectedPolygon.id.toUpperCase() }} polygon
              </div>
            </template>
          </info-window>
        </template>
      </google-map>

      <div class="map-info" splitpanes-min="10" splitpanes-max="70">
        <template v-if="selectedPolygonCensusData">
          <h4>{{ selectedPolygonCensusData.State }} Information</h4>

          <div class="px-3">
            <div>
              <strong>Rank:</strong>
              {{ selectedPolygonCensusData.Rank }}
            </div>
            <div>
              <strong>Population:</strong>
              {{ selectedPolygonCensusData.Population }}
            </div>
            <div>
              <strong>Electoral Votes:</strong>
              {{ selectedPolygonCensusData.ElectVotes }}
            </div>
            <div>
              <strong>House Seats:</strong>
              {{ selectedPolygonCensusData.HouseSeats }}
            </div>
          </div>
        </template>
      </div>
    </split-pane>
  </application-content>
</template>

<style lang="scss" scoped>
@import "~@cdpjs/vue-components/src/scss/variables";

.map-view-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100vh;
  width: calc(100vw + 50px);
  margin: -1 * $app-content-padding;  /* negate application-content padding */

  .map-container {
    width: 100%;
    height: 100%;
  }

  .map-info {
    padding: $app-content-padding;
  }
}
</style>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import axios from 'axios';
import {
  ApplicationContent, SplitPane, GoogleMap, InfoWindow, MapPolygon,
} from '@cdpjs/vue-components';
import { ColorScale } from '../helpers/maps';

const statePolygonColors = {};

export default {
  name: 'MapView',
  components: {
    ApplicationContent,
    GoogleMap,
    InfoWindow,
    MapPolygon,
    SplitPane,
  },
  data() {
    return {
      polygons: {
        states: [],
      },
      censusData: {
        states: {},
      },
      colorScales: {},
      level: 'states',
      selectedPolygon: null,
      infoWindow: {
        position: {
          lat: 38,
          lng: -99,
        },
        visible: false,
      },
    };
  },
  computed: {
    ...mapState(['sideNav']),

    visiblePolygons() {
      const { level, polygons } = this;
      const { [level]: visiblePolygons } = polygons;
      return visiblePolygons;
    },

    selectedPolygonCensusData() {
      const { censusData, selectedPolygon } = this;
      const { populations } = censusData.states;
      return selectedPolygon ? populations[selectedPolygon.id] : null;
    },
  },
  methods: {
    getStatePolygonColor(id) {
      if (!statePolygonColors[id]) {
        const { states: statesColorScale } = this.colorScales;
        const { Population: population } = this.censusData.states.populations[id] || {};
        statePolygonColors[id] = statesColorScale.getColor(population);
      }

      return statePolygonColors[id];
    },
    getStateCensusData() {
      return axios.get('/census-data').then((response) => {
        if (response.data && Array.isArray(response.data)) {
          const populations = response.data.reduce((obj, state) => {
            const { id } = state;
            return {
              ...obj,
              [id]: state,
            };
          }, {});

          const minPopulation = response.data.reduce((min, state) => {
            const { Population } = state;
            return (min < 0 || Population < min) ? Population : min;
          }, -1);

          const maxPopulation = response.data.reduce((max, state) => {
            const { Population } = state;
            return (Population > max) ? Population : max;
          }, -1);

          Vue.set(this.colorScales, 'states', new ColorScale({ min: minPopulation, max: maxPopulation }));
          Vue.set(this.censusData, 'states', { populations, minPopulation, maxPopulation });
        }
      });
    },
    getStatePolygons() {
      return axios.get('/polygons/states').then((response) => {
        if (response.data && Array.isArray(response.data)) {
          Vue.set(this.polygons, 'states', response.data);
        }
      });
    },
    infoWindowClosed() {
      this.selectedPolygon = null;
      this.infoWindow.visible = false;
    },
    showInfoWindow(polygon) {
      const { id, center } = polygon;
      this.selectedPolygon = { id };
      this.infoWindow.position = center;
      this.infoWindow.visible = true;
    },
  },
  mounted() {
    const { getStateCensusData, getStatePolygons } = this;
    // Make sure to get census data first, because this is where the ColorScale is initialized
    getStateCensusData().then(getStatePolygons);
  },
};
</script>
