<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5">Listagem de Usuários</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="filters.name"
                  label="Filtrar por nome ou email"
                  filled
                  clearable
                  debounce="300"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append>
                    <q-icon v-if="filters.name" name="close" class="cursor-pointer" @click="filters.name = ''" />
                  </template>
                </q-input>
              </div>
              
              <div class="col-12 col-md-6">
                <q-select
                  v-model="filters.permission"
                  :options="permissionsOptions"
                  label="Filtrar por permissão"
                  filled
                  clearable
                  emit-value
                  map-options
                >
                  <template v-slot:prepend>
                    <q-icon name="filter_list" />
                  </template>
                </q-select>
              </div>
            </div>
            
            <div class="row q-mt-md">
              <div class="col-12">
                <div class="flex justify-between items-center">
                  <div>
                    <q-badge color="primary" class="q-pa-xs">
                      {{ users.length }} usuários encontrados
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <q-table
              :rows="users"
              :columns="columns"
              row-key="id"
              row
              binary-state-sort
              flat
              bordered
            >            
              <template v-slot:body-cell-usuario="props">
                <q-td :props="props">
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <img :src="props.row.imagem || '/api/placeholder/40/40'" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ props.row.nome }}</q-item-label>
                      <q-item-label caption>{{ props.row.email }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-td>
              </template>
              
              <template v-slot:body-cell-approved="props">
                <q-td :props="props" class="text-center">
                  <q-chip
                    :color="props.row.approved ? 'positive' : 'negative'"
                    text-color="white"
                    dense
                    class="q-px-sm"
                  >
                    {{ props.row.approved ? 'Aprovado' : 'Não aprovado' }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-permissions="props">
                <q-td :props="props">
                  <div class="q-gutter-xs">
                    <q-chip
                      v-for="permission in props.row.permissions"
                      :key="permission"
                      :style="{ backgroundColor: stringToColor(permission.name), color: 'white' }"
                      text-color="white"
                      size="sm"
                      dense
                    >
                      {{ permission.name }}
                    </q-chip>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-center">
                  <div class="q-gutter-xs">
                    <q-btn
                      flat
                      round
                      color="info"
                      icon="visibility"
                      size="sm"
                      @click="userView(props.row)"
                    >
                      <q-tooltip>Ver detalhes</q-tooltip>
                    </q-btn>                      
                  </div>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="full-width row flex-center q-pa-md text-grey">
                  <q-icon name="people" size="2em" class="q-mr-sm" />
                  Nenhum usuário encontrado.
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from 'vue';
import api from 'src/services/api';
import { useColor } from 'src/composables/useColor';

export default defineComponent({
  name: 'UsersList',
  
  setup() {
    let users = ref([]);
    let permissionsOptions = ref([]);
    const loading = ref(false);
    const { stringToColor } = useColor();

    onMounted(() => {
      loadUsers();
      loadPermissionsOptions();
    });
    
    const filters = reactive({
      name: '',
      permission: null
    });  
    
    const columns = [
      { name: 'name', label: 'Nome', field: 'name', sortable: true, align: 'left' },
      { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'left' },
      { name: 'approved', label: 'Status', field: 'approved', sortable: true, align: 'left' },
      { name: 'permissions', label: 'Permissões', field: 'permissions', sortable: false, align: 'left' },
      { name: 'actions', label: 'Ações', field: 'act/ Inclui as permissões após criar o usuárioions', align: 'left' }
    ];
    
    async function loadUsers() {
      await api.get('/users', {
        params: {
          search: filters?.name,
          permission: filters?.permission,     
        }
      }).then((res) => {
        users.value = res.data;
      }).catch((err) => {
        console.log(err)
      })
    } 

    async function loadPermissionsOptions() {
      await api.get(`/permissions`).then((res) => {
        permissionsOptions.value = res.data;
      }).catch((err) => {
        console.log(err);
      })
    };

    function userView(user) {
      this.$router.push(`/app/usuarios/${user.id}`)
    }

    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 1000);

    watch(filters, () => {
      loadUsers();
    }, { deep: true });
    
    return {
      loading,
      columns,
      filters,
      userView,
      users,
      stringToColor,
      permissionsOptions,
    };
  }
});
</script>