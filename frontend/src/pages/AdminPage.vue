<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5">Dashboard de Permissões de Usuários</div>
            <div class="text-subtitle2">Monitoramento de acessos ao sistema</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Total de Usuários</div>
            <div class="text-h3 text-center q-mt-md">{{ users.length }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Total de Permissões</div>
            <div class="text-h3 text-center q-mt-md">5</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Média de Permissões/Usuário</div>
            <div class="text-h3 text-center q-mt-md">{{ avaragePermissionsPerUser.toFixed(1) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Distribuição de Permissões</div>
          </q-card-section>
          <q-card-section>
            <div id="bar-chart" style="height: 300px;"></div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Usuários com Acesso Administrativo</div>
          </q-card-section>
          <q-card-section>
            <div id="pizza-chart" style="height: 300px;"></div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Lista de Usuários e Permissões</div>
          </q-card-section>
          <q-card-section>
            <q-table
              :rows="users"
              :columns="columns"
              row-key="id"
              v-model="paginacao"
              :filter="filtro"
            >
              <template v-slot:top>
                <q-input dense debounce="300" v-model="filtro" placeholder="Buscar">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-approved="{ row }">
                <q-td>
                  {{ row.approved ? 'Aprovado' : 'Não aprovado' }}
                </q-td>
              </template>

              <template v-slot:body-cell-permissions="props">
                <q-td :props="props">
                  <q-chip
                    v-for="permission in props.row.permissions"
                    :key="permission"
                    :style="{ backgroundColor: stringToColor(permission.name), color: 'white' }"
                    text-color="white"
                    size="sm"
                    class="q-ma-xs"
                  >
                    {{ permission.name }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="{ row }">
                <q-td>
                  <q-btn flat round dense icon="more_vert">
                    <q-menu>
                      <q-list style="min-width: 150px">
                        <q-item clickable @click="viewUser(row)">
                          <q-item-section class="q-gutter-xs">
                            <div class="row items-center">
                              <q-icon name="visibility" class="q-mr-sm" />
                              Visualizar
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-item clickable @click="removeUser(row)">
                          <q-item-section class="q-gutter-xs">
                            <div class="row items-center">
                              <q-icon name="delete" class="q-mr-sm" />
                              Remover
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-td>
              </template>

            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import api from 'src/services/api';

export default defineComponent({
  name: 'DashboardPermissoes',

  setup() {
    let barChart = null;
    let pizzaChart = null;
    let users = ref([]);
    let permissions = ref([]);

    async function loadUsers() {
      await api.get('/users/').then((res) => {
        users.value = res.data;
      }).catch((err) => {
        console.log(err)
      })
    } 

    async function loadPermissions() {
      await api.get('/admin/permissions').then((res) => {
        permissions.value = res.data;
      }).catch((err) => {
        console.log(err);
      })
    }

    const columns = [
      { name: 'name', label: 'Nome', field: 'name', sortable: true, align: 'left' },
      { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'left' },
      { name: 'approved', label: 'Status', field: 'approved', sortable: true, align: 'left' },
      { name: 'permissions', label: 'Permissões', field: 'permissions', sortable: false, align: 'left' },
      { name: 'actions', label: 'Ações', field: 'actions', align: 'left' }
    ];

    const paginacao = ref({
      rowsPerPage: 5
    });
    
    const filtro = ref('');

    const avaragePermissionsPerUser = computed(() => {
      const total = users.value.reduce((acc, user) => acc + user.permissions.length, 0);
      return total / users.value.length;
    });

    const permissionsCount = computed(() => {
      const count = {};

      permissions.value.forEach(permission => {
        const validUsersCount = permission.users.length;
        
        count[permission.name] = validUsersCount;
      });

      return count;
    });

    const percentualAdminUsers = computed(() => {
      const adminUsers = users.value.filter(user => 
        user.permissions.some(p => 
          p.name === 'Admin' && 
          !p.isRevoked && 
          new Date(p.expiresAt) > new Date()
        )
      );
      
      return {
        admin: adminUsers.length,
        naoAdmin: users.value.length - adminUsers.length
      };
    });

    function startCharts() {
      barChart = echarts.init(document.getElementById('bar-chart'));
      pizzaChart = echarts.init(document.getElementById('pizza-chart'));
      
      refreshCharts();

      window.addEventListener('resize', () => {
        barChart?.resize();
        pizzaChart?.resize();
      });
    }

    function stringToColor(str) {
      let hash = 0;

      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      const r = (hash >> 16) & 0xFF;
      const g = (hash >> 8) & 0xFF; 
      const b = hash & 0xFF;        

      return `rgb(${r}, ${g}, ${b})`;
    }

    function viewUser(row) {
      this.$router.push(`/app/admin/permissoes-de-usuario/${row.id}`)
    }

    function refreshCharts() {
      const barOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: Object.keys(permissionsCount.value).map(p => p.charAt(0).toUpperCase() + p.slice(1))
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Número de Usuários',
            type: 'bar',
            data: Object.values(permissionsCount.value),
            itemStyle: {
              color: function(params) {
                return stringToColor(params.name);
              }
            }
          }
        ]
      };

      const pizzaOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['Administradores', 'Usuários Regulares']
        },
        series: [
          {
            name: 'Permissões',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              { 
                value: percentualAdminUsers.value.admin, 
                name: 'Administradores',
                itemStyle: { color: '#f44336' }
              },
              { 
                value: percentualAdminUsers.value.naoAdmin, 
                name: 'Usuários Regulares',
                itemStyle: { color: '#2196f3' }
              }
            ]
          }
        ]
      };
      
      barChart?.setOption(barOptions);
      pizzaChart?.setOption(pizzaOptions);
    }

    onMounted(() => {
      loadUsers();
      loadPermissions();
      setTimeout(startCharts, 1000);
    });

    watch(users, () => {
      refreshCharts();
    }, { deep: true });

    return {
      columns,
      paginacao,
      filtro,
      avaragePermissionsPerUser,
      permissionsCount,
      percentualAdminUsers,
      stringToColor,
      viewUser,
      users
    };
  }
});
</script>