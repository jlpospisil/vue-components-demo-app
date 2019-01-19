<template>
  <top-navbar
    id="app-top-nav"
    :leftSideNavOpen="sideNav.open"
  >
    <template slot="brand">
      <icon
        type="solid"
        name="fa-bars"
        @click="toggleSideNav"
      />
    </template>

    <template slot="leftLinks">
      <top-navbar-link
        tag="router-link"
        to="/"
        :active="currentPath === '/'"
      >
        Home
      </top-navbar-link>

      <top-navbar-link
        tag="router-link"
        to="/about"
        :active="currentPath === '/about'"
      >
        About
      </top-navbar-link>
    </template>
  </top-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
  Icon,
  TopNavbar,
  TopNavbarLink,
} from '@cdpjs/vue-components';

export default {
  name: 'AppTopNav',
  components: {
    Icon,
    TopNavbar,
    TopNavbarLink,
  },
  computed: {
    ...mapState([
      'sideNav',
    ]),
    currentPath() {
      const { path } = this.$route;
      return path;
    },
  },
  methods: {
    ...mapActions([
      'toggleSideNav',
    ]),
  },
};
</script>
