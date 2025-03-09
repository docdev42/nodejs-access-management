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
          <EssentialLink icon="person" title="Minha Página" @click="verPerfil" />
          <EssentialLink icon="logout" title="Sair" @click="logout" />
        </q-list>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
const linksList = [
  {
    title: 'Painel administrativo',
    icon: 'admin_panel_settings',
    link: '/admin'
  },
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard'
  },
  {
    title: 'Usuários',
    icon: 'group',
    link: '/usuarios'
  }
]

function toggleDarkMode() {
  console.log('fu');
  $q.dark.toggle();
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer () {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>