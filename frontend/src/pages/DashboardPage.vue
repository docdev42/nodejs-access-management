<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Gerenciamento de Usuários</div>
      </q-card-section>
      
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        dense
      >
        <template v-slot:body-cell-status="{ row }">
          <q-td>
            <q-badge :color="row.status ? 'green' : 'red'">
              {{ row.status ? 'Aceito' : 'Pendente' }}
            </q-badge>
            <q-btn v-if="!row.status" @click="acceptUser(row)" color="primary" size="sm" dense class="q-ml-md">
              Aceitar
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="{ row }">
          <q-td>
            <q-btn flat round dense icon="more_vert">
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item clickable @click="viewUser(row)">
                    <q-item-section>Visualizar</q-item-section>
                  </q-item>
                  <q-item clickable @click="removeUser(row)">
                    <q-item-section>Remover</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: 'João Silva', email: 'joao@email.com', status: false },
        { id: 2, name: 'Maria Oliveira', email: 'maria@email.com', status: true },
        { id: 3, name: 'Carlos Souza', email: 'carlos@email.com', status: false }
      ],
      columns: [
        { name: 'name', label: 'Nome', field: 'name', align: 'left' },
        { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
        { name: 'status', label: 'Status', field: row => row.status, align: 'center' },
        { name: 'actions', label: 'Ações', field: 'actions', align: 'right' }
      ]
    };
  },
  methods: {
    acceptUser(user) {
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index].status = true;
        this.$q.notify({ type: 'positive', message: `Usuário ${user.name} aceito!` });
      }
    },
    removeUser(user) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.$q.notify({ type: 'negative', message: `Usuário ${user.name} removido!` });
    },
    viewUser(user) {
      this.$q.notify({ type: 'info', message: `Visualizando ${user.name}` });
      // Aqui pode ser implementada uma navegação para uma página de detalhes
    }
  }
};
</script>

<style scoped>
.q-card {
  max-width: 800px;
  margin: auto;
}
</style>
