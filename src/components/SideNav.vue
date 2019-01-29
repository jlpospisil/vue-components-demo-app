<template>
  <side-nav :open="sideNav.open">
    <div slot="header">
      Header Here
    </div>

    <div slot="content">
      <side-nav-group class="mt-3">
        <side-nav-group-header>
          Section Header
        </side-nav-group-header>

        <side-nav-link
          label="Home"
          :icon="{
            type: 'solid',
            name: 'fa-home',
          }"
          router-link
          to="/"
        />

        <side-nav-link
          label="About Us"
          :icon="{
            type: 'solid',
            name: 'fa-info',
          }"
          router-link
          to="/about"
        />

        <side-nav-link
          label="Map Example"
          :icon="{
            type: 'solid',
            name: 'fa-map',
          }"
          router-link
          to="/map"
        />
      </side-nav-group>
    </div>

    <div slot="footer">
      Footer Here
    </div>
  </side-nav>
</template>

<script>
import { mapState } from 'vuex';

import {
  SideNav,
  SideNavGroup,
  SideNavGroupHeader,
  SideNavLink,
} from '@cdpjs/vue-components';

export default {
  name: 'AppSideNav',
  components: {
    SideNav,
    SideNavGroup,
    SideNavGroupHeader,
    SideNavLink,
  },
  computed: {
    ...mapState([
      'sideNav',
    ]),
  },
};
</script>
