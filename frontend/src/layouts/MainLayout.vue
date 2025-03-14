<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <q-icon name="verified_user" />
          </q-avatar>
          Gerenciador de acessos
        </q-toolbar-title>

        <q-btn 
          flat 
          :icon="$q.dark.isActive ? 'brightness_7' : 'brightness_4'" 
          @click="toggleDarkMode" 
          :label="$q.dark.isActive ? 'Modo claro' : 'Modo escuro'"
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
        <div class="q-mb-md flex flex-center">
          <q-avatar size="80px">
            <img src="https://cdn.quasar.dev/img/avatar.png" alt="Avatar">
          </q-avatar>
        </div>

        <div class="text-center text-h6 q-mb-md">
          {{ userInfo.name }}
        </div>

        <q-separator />

        <q-list class="q-mt-md">
          <EssentialLink
          v-for="link in userLinks"
          :key="link.title"
          v-bind="link"
          target="_self"
          @click="() => link.action ? link.action() : $router.push(link.link)"
        />
        </q-list>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar'
import api from 'src/services/api';
import { jwtDecode } from 'jwt-decode';

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  setup() {
    let leftDrawerOpen = ref(false);
    let rightDrawerOpen = ref(false);
    let userInfo = ref({});
    const $q = useQuasar();
    const linksList = ref([
      {
        title: 'Painel administrativo',
        icon: 'admin_panel_settings',
        link: '/app/admin'
      },
      {
        title: 'Página de boas vindas',
        icon: 'sentiment_satisfied',
        link: '/app/welcome'
      },
      {
        title: 'Usuários',
        icon: 'group',
        link: '/app/usuarios'
      }
    ]);
    let userLinks = ref([]);
    onMounted(() => {
      getUserInfo();
      
      const darkMode = JSON.parse(localStorage.getItem('darkMode'));
      if (darkMode !== null) {
        $q.dark.set(darkMode);
      }

      userLinks.value = [
        {
          title: 'Minha página',
          icon: 'person',
          link: `/app/usuarios/${userInfo.value.sub}`, 
        },
        {
          title: 'Sair',
          icon: 'logout',
          action: handleLogout,
        },
      ]
    });
    function getUserInfo() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          userInfo.value = decoded;
          console.log(userInfo)
        } catch (error) {
          console.error('Erro ao decodificar o token', error);
          return null;
        }
      }

      return null;
    };
    function toggleDarkMode() {
      const isDarkMode = $q.dark.isActive;
      $q.dark.set(!isDarkMode);
      localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
    };
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value
    };
    function toggleRightDrawer() {
      rightDrawerOpen.value = !rightDrawerOpen.value
    };
    async function handleLogout() {
      await api.post('/auth/logout')
      .then(() => {
        localStorage.setItem('token', '');
        this.$router.push('/')
      })
      .catch((err) => {
        $q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Erro ao deslogar usuário!',
        });
      });
    };

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      userInfo,
      $q,
      linksList,
      userLinks,
      getUserInfo,
      toggleDarkMode,
      toggleLeftDrawer,
      toggleRightDrawer,
      handleLogout,
    }
  }
})
</script>