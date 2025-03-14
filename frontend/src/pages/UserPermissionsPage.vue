<template>
  <q-page padding v-if="user">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Informações do Usuário</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2">Nome</q-item-label>
              <q-item-label>{{ user.name }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2">E-mail</q-item-label>
              <q-item-label>{{ user.email }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2">Data de Nascimento</q-item-label>
              <q-item-label>{{ user.birthday ? date.formatDate(user.birthday, 'DD/MM/YYYY') : '-' }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2">Último Acesso</q-item-label>
              <q-item-label>{{ user.lastLoginAt ? date.formatDate(user.lastLoginAt, 'DD/MM/YYYY HH:mm') : '-' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Permissões</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-btn label="Adicionar Permissão" color="primary" class="q-mt-md" @click="showAddPermission = true" />

        <q-list>
          <q-item v-for="(perm, index) in sortedPermissions" :key="index">
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ perm.permission.name }}</q-item-label>
              <q-item-label caption>Expira em: {{ date.formatDate(perm.expiresAt, 'DD/MM/YYYY HH:mm') }}</q-item-label>
            </q-item-section>

            <q-item-section side v-if="(new Date() < new Date(perm.expiresAt)) && !perm.isRevoked">
              <q-btn icon="close" flat round color="red" @click="revokePermission(perm)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showAddPermission">
      <q-card>
        <q-card-section>
          <div class="text-h6">Adicionar Permissão</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="newPermission"
            :options="permissionsOptions"
            option-label="name"
            option-value="id"
            label="Permissão"
            dense
            emit-value
            map-options
          />
          <q-input v-model="expiresAt" label="Validade" dense type="datetime-local" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" :label="editingIndex === null ? 'Adicionar' : 'Salvar'" @click="savePermission" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import api from 'src/services/api';
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { date, useQuasar } from 'quasar';

export default defineComponent({
  name: 'UserPermissionsPage',
  
  setup() {
    let user = ref(null);
    let permissionsOptions = ref([]);
    let showAddPermission = ref(false);
    let newPermission = ref({ name: "", expiry: "" });
    let expiresAt = ref(null);
    let editingIndex = ref(null);

    const $q = useQuasar();
    const route = useRoute();
    const userId = route.params.id;

    onMounted(() => {
      loadUser();
      loadPermissionsOptions();
    });

    async function loadUser() {
      await api.get(`admin/users/${userId}`).then((res) => {
        user.value = res.data;
      }).catch((err) => {
        $q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Erro ao carregar informações do usuário',
        });
      })
    };

    async function loadPermissionsOptions() {
      await api.get(`/admin/permissions`).then((res) => {
        permissionsOptions.value = res.data;
      }).catch((err) => {
        $q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Erro ao carregar as permissões',
        });
      })
    };

    async function savePermission() {
    const payload = {
      userId: user.value.id,
      permissionId: newPermission.value,
      expiresAt: expiresAt.value,
    };
    await api.post('/admin/user-permissions', payload)
      .then((res) => {
        showAddPermission.value = false;
        user.value.permissions.push(res.data)
        newPermission.value = null;
        expiresAt.value = null;
        $q.notify({
          type: 'positive',
          message: 'Permissão atribuida com sucesso',
        });
      })
      .catch((err) => {
        $q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Erro ao atribuir permissão ao usuário',
        });
      });
  }

    async function revokePermission(perm) {
      await api.patch(`/admin/user-permissions/${perm.id}/revoke`).then(() => {
        perm.isRevoked = true;
        $q.notify({
          type: 'positive',
          message: 'Permissão revogada com sucesso',
        });
      }).catch((err) => {
        $q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Erro ao revogar permissão',
        });
      })
    };

    const sortedPermissions = computed(() => {
      return [...user.value.permissions].sort((a, b) => {
        const now = new Date();

        if (a.isRevoked && !b.isRevoked) return 1;
        if (!a.isRevoked && b.isRevoked) return -1;

        const dateA = new Date(a.expiresAt);
        const dateB = new Date(b.expiresAt);

        const aExpired = dateA < now;
        const bExpired = dateB < now;

        if (aExpired && !bExpired) return 1;
        if (!aExpired && bExpired) return -1;

        return dateA - dateB;
      });
    });

    return {
      user,
      permissionsOptions,
      showAddPermission,
      newPermission,
      editingIndex,
      savePermission,
      revokePermission,
      date,
      expiresAt,
      sortedPermissions,
      $q,
    };
  }
});
</script>
