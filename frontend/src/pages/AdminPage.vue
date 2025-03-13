// DashboardPermissoes.vue
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
            <div class="text-h3 text-center q-mt-md">{{ mediaPermissoesPorUsuario.toFixed(1) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Distribuição de Permissões</div>
          </q-card-section>
          <q-card-section>
            <div id="grafico-barras" style="height: 300px;"></div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Usuários com Acesso Administrativo</div>
          </q-card-section>
          <q-card-section>
            <div id="grafico-pizza" style="height: 300px;"></div>
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
                    :color="corPermissao(permission)"
                    text-color="white"
                    size="sm"
                    class="q-ma-xs"
                  >
                    {{ permission }}
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
    let graficoBarra = null;
    let graficoPizza = null;
    let users = ref([]);

    async function loadUsers() {
      await api.get('/users/').then((res) => {
        users.value = res.data;
        console.log(res)
      }).catch((err) => {
        console.log(err)
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

    const mediaPermissoesPorUsuario = computed(() => {
      const total = users.value.reduce((acc, user) => acc + user.permissions.length, 0);
      return total / users.value.length;
    });

    // Contagem de permissões para gráficos
    const contagemPermissoes = computed(() => {
      const contagem = {
        'painel administrativo': 0,
        'ver dashboard': 0,
        'ver usuários': 0,
        'ver perfil de outros usuários': 0,
        'ativar usuários': 0
      };
      
      users.value.forEach(user => {
        user.permissions.forEach(perm => {
          contagem[perm]++;
        });
      });
      
      return contagem;
    });

    const percentualAdminUsers = computed(() => {
      const adminUsers = users.value.filter(u => 
        u.permissions.includes('painel administrativo')
      ).length;
      
      return {
        admin: adminUsers,
        naoAdmin: users.value.length - adminUsers
      };
    });

    function corPermissao(permissao) {
      const cores = {
        'painel administrativo': 'red',
        'ver dashboard': 'green',
        'ver usuários': 'blue',
        'ver perfil de outros usuários': 'purple',
        'ativar usuários': 'black'
      };
      
      return cores[permissao] || 'grey';
    }

    function inicializarGraficos() {
      // Inicializar gráfico de barras
      graficoBarra = echarts.init(document.getElementById('grafico-barras'));
      
      // Inicializar gráfico de pizza
      graficoPizza = echarts.init(document.getElementById('grafico-pizza'));
      
      atualizarGraficos();
      
      // Ajustar tamanho dos gráficos quando a janela é redimensionada
      window.addEventListener('resize', () => {
        graficoBarra?.resize();
        graficoPizza?.resize();
      });
    }

    function viewUser(row) {
      console.log(row)
      this.$router.push(`/app/admin/permissoes-de-usuario/${row.id}`)
    }

    function atualizarGraficos() {
      const opcoesBarra = {
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
          data: Object.keys(contagemPermissoes.value).map(p => p.charAt(0).toUpperCase() + p.slice(1))
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Número de Usuários',
            type: 'bar',
            data: Object.values(contagemPermissoes.value),
            itemStyle: {
              color: function(params) {
                const cores = ['#f44336', '#4caf50', '#2196f3', '#9c27b0', '#000000'];
                return cores[params.dataIndex];
              }
            }
          }
        ]
      };
      
      // Configurar gráfico de pizza
      const opcoesPizza = {
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
      
      graficoBarra?.setOption(opcoesBarra);
      graficoPizza?.setOption(opcoesPizza);
    }

    onMounted(() => {
      loadUsers();
      setTimeout(inicializarGraficos, 100);
    });

    watch(users, () => {
      atualizarGraficos();
    }, { deep: true });

    return {
      columns,
      paginacao,
      filtro,
      mediaPermissoesPorUsuario,
      contagemPermissoes,
      percentualAdminUsers,
      corPermissao,
      viewUser,
      users
    };
  }
});
</script>