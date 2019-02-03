<template>
  <application-content
    class="map-view-container"
    :leftSideNavOpen="sideNav.open"
  >
    <button-item
      class="btn-sm btn-map ml-3 mt-3"
      icon_type="solid"
      icon="fa-search-minus"
      text="Zoom Out"
      v-show="previousLevel"
      @click="zoomOut"
    />

    <button-item
      class="btn-sm btn-map ml-3 mt-3"
      icon_type="solid"
      :icon="`${detailedStatePolygons ? 'fa-globe' : 'fa-globe-americas'}`"
      :text="`Show ${detailedStatePolygons ? 'Simple' : 'Detailed'}`"
      v-show="level === 'states'"
      @click="toggleStatePolygonDetailLevel"
    />

    <split-pane horizontal watch-slots>
      <google-map
        :options="mapOptions"
        splitpanes-default="75"
        @ready="mapReady"
      >
        <template slot-scope="{ google, map }">
          <template v-for="state in visiblePolygons">
            <map-polygon
              v-for="(polygon, polygonIndex) in state.polygons"
              ref="visiblePolygons"
              :key="`${state.id}-polygon-${polygonIndex}`"
              :paths="polygon"
              :google="google"
              :map="map"
              :options="{
             id: state.id,
             strokeColor: getStatePolygonColor(state.id),
             fillColor: getStatePolygonColor(state.id),
            }"
              @click="showInfoWindow"
            />
          </template>

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
              <div class="mt-3" v-show="nextLevel">
                <button-item
                  icon_type="solid"
                  icon="fa-search-plus"
                  text="Zoom In"
                  class="btn-sm"
                  onclick="zoomIn()"
                />
              </div>
            </template>
          </info-window>
        </template>
      </google-map>

      <div class="map-info" splitpanes-default="25" splitpanes-min="10" splitpanes-max="70">
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
  padding-bottom: 0;

  .btn-map {
    position: absolute;
    z-index: 500;
  }

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
  ApplicationContent, SplitPane, GoogleMap, InfoWindow, MapPolygon, ButtonItem,
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
    ButtonItem,
  },
  data() {
    return {
      google: null,
      map: null,
      mapOptions: {
        center: {
          lat: 38,
          lng: -99,
        },
        zoom: 4,
        disableDefaultUI: true,
      },
      polygons: {
        states: [],
        counties: [],
      },
      censusData: {
        states: {},
        counties: {},
      },
      detailedStatePolygons: false,
      colorScales: {},
      level: 'states',
      levels: ['states', 'counties'],
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

    nextLevel() {
      const { level, levels } = this;
      const currentIndex = levels.indexOf(level);
      return currentIndex !== -1 && currentIndex < levels.length - 1
        ? levels[currentIndex + 1]
        : null;
    },

    previousLevel() {
      const { level, levels } = this;
      const currentIndex = levels.indexOf(level);
      return currentIndex > 0 ? levels[currentIndex - 1] : null;
    },
  },
  methods: {
    getCountyPolygons(stateId) {
      const { detailedStatePolygons } = this;
      return axios.get(`/${detailedStatePolygons ? 'detailed-' : ''}polygons/states/${stateId}/counties`).then((response) => {
        if (response.data && Array.isArray(response.data)) {
          Vue.set(this.polygons, 'counties', response.data);
        }
      });
    },
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
      const { detailedStatePolygons } = this;

      return axios.get(`/${detailedStatePolygons ? 'detailed-' : ''}polygons/states`).then((response) => {
        if (response.data && Array.isArray(response.data)) {
          Vue.set(this.polygons, 'states', response.data);
        }
      });
    },
    infoWindowClosed() {
      this.selectedPolygon = null;
      this.infoWindow.visible = false;
    },
    mapReady({ google, map }) {
      Vue.set(this, 'google', google);
      Vue.set(this, 'map', map);
    },
    showInfoWindow(polygon) {
      const { id, center } = polygon;
      this.selectedPolygon = { id };
      this.infoWindow.position = center;
      this.infoWindow.visible = true;
    },
    toggleStatePolygonDetailLevel() {
      const { detailedStatePolygons, getStatePolygons, infoWindowClosed } = this;
      this.detailedStatePolygons = !detailedStatePolygons;
      Vue.set(this.polygons, 'states', []);
      infoWindowClosed();
      getStatePolygons();
    },
    zoomIn() {
      const { nextLevel, infoWindowClosed, getCountyPolygons, zoomMapToBounds } = this;
      const { id: selectedPolygonId } = this.selectedPolygon;

      if (nextLevel) {
        if (nextLevel === 'counties') {
          getCountyPolygons(selectedPolygonId).then(zoomMapToBounds);
        }

        infoWindowClosed();
        this.level = nextLevel;
      }
    },
    zoomOut() {
      const { previousLevel, infoWindowClosed, zoomMapToBounds } = this;

      if (previousLevel) {
        infoWindowClosed();
        this.level = previousLevel;
        zoomMapToBounds();
      }
    },
    zoomMapToBounds() {
      const { visiblePolygons, map, mapOptions, level } = this;
      const { maps } = this.google;

      if (level === 'states') {
        map.setOptions(mapOptions);
      } else {
        const bounds = new maps.LatLngBounds();
        const points = visiblePolygons.flatMap(item => item.polygons).flat();

        points.forEach(point => bounds.extend(point));

        map.fitBounds(bounds);
      }
    },
  },
  mounted() {
    const { getStateCensusData, getStatePolygons, zoomIn } = this;

    // Make sure to get census data first, because this is where the ColorScale is initialized
    getStateCensusData().then(getStatePolygons);

    // Add methods that are called within the info window to the window
    //  since that is the only way they are available
    window.zoomIn = zoomIn;
  },
};
</script>
