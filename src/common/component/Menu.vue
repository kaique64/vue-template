<template>
  <MiniLoadingSpinner v-if="!role"/>
  <div
      v-else
      id="menu"
      class="font-regular-bosch q-pa-md cursor-pointer non-selectable text-black q-gutter-md row items-center"
      :class="{'justify-between': role !== 'public', 'justify-center': role === 'public'}"
      style="font-size: 18px;"
  >
    <router-link v-if="role !== 'public'" to="/" class="custom-menu">
      <div :class="getClass('home')">Home</div>
    </router-link>
    <router-link
        to="/projects"
        class="custom-menu"
        :class="{'q-mr-lg': role === 'public'}"
    >
      <div :class="getClass('projects')">Projects</div>
    </router-link>
    <router-link v-if="role !== 'public'" to="/experts" class="custom-menu">
      <div :class="getClass('experts')">Experts</div>
    </router-link>
    <router-link v-if="role !== 'public'" to="/dashboards" class="custom-menu">
      <div :class="getClass('dashboards')">Dashboards</div>
    </router-link>
    <router-link v-if="isAdmin" to="/master-data" class="custom-menu">
      <div :class="getClass('master-data')">Master Data</div>
    </router-link>
    <div v-if="isAdmin" class="custom-menu" @mousedown="openAndCloseSettings">
      Settings
      <q-icon :name="settingsLinksOpen ? 'expand_less' : 'expand_more'" @mousedown="openAndCloseSettings"/>
      <q-menu id="menu-list" class="font-regular-bosch" anchor="bottom left">
        <q-list dense style="min-width: 100px">
          <router-link
              to="/project-type"
              class="custom-menu"
              @click="openAndCloseSettings"
          >
            <q-item clickable dense>
              <q-item-section v-close-popup>
                <div :class="`row items-center q-justify-between text-left ${getClass('master-data')}`">
                  <q-icon class="q-pr-xs" name="mdi-format-list-bulleted-type" size="20px" />
                  Project Type
                </div>
              </q-item-section>
            </q-item>
          </router-link>
        </q-list>
      </q-menu>
    </div>
    <div class="custom-menu" @mousedown="openAndCloseHelper">
      Help
      <q-icon :name="helpLinksOpen ? 'expand_less' : 'expand_more'" @mousedown="openAndCloseHelper"/>
      <q-menu id="menu-list" class="font-regular-bosch" anchor="bottom left">
        <q-list dense style="min-width: 100px">
          <a
            href="https://inside-docupedia.bosch.com/confluence/display/TETBOX/User+Manual+RVT"
            class="custom-menu"
            target="_blank"
            @click="openAndCloseHelper"
          >
            <q-item clickable dense>
              <q-item-section v-close-popup>
                <div class="row items-center q-justify-between text-left">
                  User Manual
                  <q-icon class="q-pl-xs link-icon" name="mdi-open-in-new"/>
                </div>
              </q-item-section>
            </q-item>
          </a>
          <a
            href="https://rb-tracker.bosch.com/tracker17/servicedesk/customer/portal/1633"
            class="custom-menu"
            target="_blank"
            @click="openAndCloseHelper"
          >
            <q-item clickable dense>
              <q-item-section v-close-popup>
                <div class="row items-center q-justify-between text-left">
                  Report a problem
                  <q-icon class="q-pl-xs link-icon" name="mdi-open-in-new"/>
                </div>
              </q-item-section>
            </q-item>
          </a>
        </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import {PermissionsStore} from "@/modules/permissions/store/PermissionsStore";
import MiniLoadingSpinner from "@/common/component/loading-spinner-mini/MiniLoadingSpinner.vue";

const route = useRoute();
const permission = PermissionsStore();
const isAdmin = computed(() => permission.getPermissions()?.isAdmin);
const role = computed(() => permission.getPermissions()?.role);
const helpLinksOpen = ref(false);
const settingsLinksOpen = ref(false);
const openAndCloseHelper = () => (helpLinksOpen.value = !helpLinksOpen.value);
const openAndCloseSettings = () => (settingsLinksOpen.value = !settingsLinksOpen.value);

function getClass(id: string) {
  const classes = ["col-auto", "column-div"];
  if (route.path === "/" && id === "home")
    classes.push("current-menu");
  if (["/projects", "/experts", "/dashboards", "/master-data"].includes(route.path) && route.path.slice(1) === id)
    classes.push("current-menu");
  return classes.join(" ");
}
</script>

<style scoped lang="scss">
.custom-menu {
  color: black;
  cursor: pointer;
  margin-bottom: none;
  text-decoration: none;
}

.current-menu {
  color: rgb(0, 0, 0);
  cursor: pointer;
  font-weight: bold;
}

.column-div {
  height: 100%;
}

.q-item.q-hoverable {
  border-radius: 0 !important;
}

.link-icon {
  color: $bosch-blue-55;
}
</style>
