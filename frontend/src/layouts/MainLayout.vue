<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>

        <q-btn 
          flat 
          :icon="this.$q.dark.isActive ? 'brightness_7' : 'brightness_4'" 
          @click="toggleDarkMode" 
          label="Modo Escuro"
        />

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" behavior="desktop" elevated>
      <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          target="_self"
        />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" elevated>
      <q-list class="q-pa-md">
        <!-- Avatar do usuário -->
        <div class="q-mb-md flex flex-center">
          <q-avatar size="80px">
            <img src="https://cdn.quasar.dev/img/avatar.png" alt="Avatar">
          </q-avatar>
        </div>

        <!-- Nome do usuário -->
        <div class="text-center text-h6 q-mb-md">
          {{ userName }} chesque
        </div>

        <q-separator />

        <!-- Opções do menu -->
        <q-list class="q-mt-md">
          <EssentialLink
          v-for="link in userLinks"
          :key="link.title"
          v-bind="link"
          target="_self"
        />
        </q-list>
      </q-list>
    </q-drawer>

    <q-page-container>
      <KeepAlive>
        <router-view />
      </KeepAlive>
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar'

export default {
  components: {
    EssentialLink, 
  },
  data() {
    return {
      linksList: [
        {
          title: 'Painel administrativo',
          icon: 'admin_panel_settings',
          link: '/admin'
        },
        {
          title: 'Dashboard',
          icon: 'dashboard',
          link: '/'
        },
        {
          title: 'Usuários',
          icon: 'group',
          link: '/usuarios'
        }
      ],
      userLinks: [
        {
          title: 'Minha página',
          icon: 'person',
          link: 'usuarios/usuario'
        },
        {
          title: 'Sair',
          icon: 'logout',
          link: '/admin'
        },
      ],
      leftDrawerOpen: ref(false),
      rightDrawerOpen: ref(false),
      $q: useQuasar()
    }
  },
  mounted() {
    const darkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (darkMode !== null) {
      this.$q.dark.set(darkMode);
    }
  },
  methods: {
    toggleDarkMode() {
      const isDarkMode = this.$q.dark.isActive;
      this.$q.dark.set(!isDarkMode);
      localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen
    }
  } 
}; 
</script>