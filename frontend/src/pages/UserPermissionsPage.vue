<template>
  <q-page padding>
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
              <q-item-label>{{ user.birthDate }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2">Último Acesso</q-item-label>
              <q-item-label>{{ user.lastAccess }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Gerenciamento de Permissões -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Permissões</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list>
          <q-item v-for="(perm, index) in user.permissions" :key="index">
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ perm.name }}</q-item-label>
              <q-item-label caption>Expira em: {{ perm.expiry }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn icon="edit" flat round @click="editPermission(index)" />
              <q-btn icon="delete" flat round color="red" @click="removePermission(index)" />
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Botão para Adicionar Permissão -->
        <q-btn label="Adicionar Permissão" color="primary" class="q-mt-md" @click="showAddPermission = true" />
      </q-card-section>
    </q-card>

    <!-- Dialog para Adicionar/Editar Permissão -->
    <q-dialog v-model="showAddPermission">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ editingIndex === null ? 'Adicionar Permissão' : 'Editar Permissão' }}</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="newPermission.name"
            :options="availablePermissions"
            label="Permissão"
            dense
          />
          <q-input v-model="newPermission.expiry" label="Validade" dense type="datetime-local" />
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
export default {
  data() {
    return {
      user: {
        name: "João Silva",
        email: "joao@email.com",
        birthDate: "1990-05-15",
        lastAccess: "2025-03-09 14:30",
        permissions: [
          { name: "Admin", expiry: "2025-06-01 23:59" },
          { name: "Editor", expiry: "2025-04-15 12:00" },
        ],
      },
      availablePermissions: ["Admin", "Editor", "Viewer", "Gerente"],
      showAddPermission: false,
      newPermission: { name: "", expiry: "" },
      editingIndex: null,
    };
  },
  methods: {
    addPermission() {
      this.newPermission = { name: "", expiry: "" };
      this.editingIndex = null;
      this.showAddPermission = true;
    },
    editPermission(index) {
      this.newPermission = { ...this.user.permissions[index] };
      this.editingIndex = index;
      this.showAddPermission = true;
    },
    savePermission() {
      if (this.editingIndex === null) {
        this.user.permissions.push({ ...this.newPermission });
      } else {
        this.user.permissions[this.editingIndex] = { ...this.newPermission };
      }
      this.showAddPermission = false;
    },
    removePermission(index) {
      this.user.permissions.splice(index, 1);
    },
  },
};
</script>
