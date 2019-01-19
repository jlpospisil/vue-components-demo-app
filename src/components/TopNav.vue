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
        :routerLink="true"
        to="/"
        :active="currentPath === '/'"
      >
        Home
      </top-navbar-link>

      <top-navbar-link
        :routerLink="true"
        to="/about"
        :active="currentPath === '/about'"
      >
        About
      </top-navbar-link>
    </template>

    <div class="nav-item dropdown ml-auto">
      <a class="nav-link dropdown-toggle user-dropdown" href="#" data-toggle="dropdown">
        <icon type="solid" name="fa-user-circle" />
        User Name
      </a>
      <div class="dropdown-menu">
        <router-link to="/settings" class="dropdown-item">
          <icon type="solid" name="fa-cog" />
          Settings
        </router-link>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="/logout">
          <icon type="solid" name="fa-sign-out-alt" />
          Logout
        </a>
      </div>
    </div>
  </top-navbar>
</template>

<style lang="scss" scoped>
$user-dropdown-color: #555555;

.user-dropdown {
  color: $user-dropdown-color;

  &:hover, &:focus {
    color: darken($user-dropdown-color, 12%);
  }
}
</style>

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
