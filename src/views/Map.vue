<template>
  <application-content
    class="map-view-container"
    :leftSideNavOpen="sideNav.open"
  >
    <split-pane horizontal>
      <google-map>
        <template slot-scope="{ google, map }">
          <map-polygon
            v-for="polygon in visiblePolygons"
            :key="polygon.id"
            :paths="polygon.paths"
            :google="google"
            :map="map"
            :options="{
             id: polygon.id,
             strokeColor: polygon.color,
             fillColor: polygon.color,
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

      <div class="map-info">
        Additional information here
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
import { mapState } from 'vuex';
import { ApplicationContent, SplitPane, GoogleMap, InfoWindow, MapPolygon } from '@cdpjs/vue-components';

export default {
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
  },
  methods: {
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
};
</script>
