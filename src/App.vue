<template>
  <div id="app">
    <top-nav />

    <side-nav />

    <application-content
      id="app-content"
      class="position-relative d-flex flex-column"
      :class="{ 'side-nav-open': sideNav.open }"
      :leftSideNavOpen="sideNav.open"
    >
      <router-view/>
    </application-content>
  </div>
</template>

<style lang="scss">
@import '~@cdpjs/vue-components/src/scss/variables';

#app {
  #app-content {
    min-height: 100vh;
    padding: 75px 25px;

    &.side-nav-open {
      padding-left: $side-nav-width + 25px;
    }
  }
}
</style>

<script>
import { mapState } from 'vuex';
import { ApplicationContent } from '@cdpjs/vue-components';
import SideNav from '@/components/SideNav.vue';
import TopNav from '@/components/TopNav.vue';

export default {
  name: 'App',
  components: {
    ApplicationContent,
    SideNav,
    TopNav,
  },
  computed: {
    ...mapState([
      'sideNav',
    ]),
  },
};
</script>
