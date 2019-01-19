<template>
  <side-nav :open="sideNav.open">
    <div slot="header">
      Header Here
    </div>

    <div slot="content">
      <side-nav-group>
        <side-nav-group-header>
          Section 1
        </side-nav-group-header>

        <side-nav-link
          label="First Link"
          :icon="{
            type: 'solid',
            name: 'fa-bone',
          }"
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
