<template>
  <application-content
    class="map-view-container"
    :leftSideNavOpen="sideNav.open"
  >
    <split-pane horizontal>
      <google-map>

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
import { ApplicationContent, GoogleMap, SplitPane } from '@cdpjs/vue-components';

export default {
  components: {
    ApplicationContent,
    GoogleMap,
    SplitPane,
  },
  computed: {
    ...mapState(['sideNav']),
  },
};
</script>
