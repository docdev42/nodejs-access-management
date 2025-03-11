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
            <div class="text-h3 text-center q-mt-md">{{ usuarios.length }}</div>
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
              :rows="usuarios"
              :columns="colunas"
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

              <template v-slot:body-cell-permissoes="props">
                <q-td :props="props">
                  <q-chip
                    v-for="permissao in props.row.permissoes"
                    :key="permissao"
                    :color="corPermissao(permissao)"
                    text-color="white"
                    size="sm"
                    class="q-ma-xs"
                  >
                    {{ permissao }}
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

export default defineComponent({
  name: 'DashboardPermissoes',

  setup() {
    let graficoBarra = null;
    let graficoPizza = null;

    // Dados de exemplo
    const usuarios = ref([
      { 
        id: 1, 
        nome: 'Admin Silva', 
        email: 'admin@exemplo.com', 
        permissoes: ['painel administrativo', 'ver dashboard', 'ver usuários', 'ver perfil de outros usuários', 'ativar usuários'],
        status: 'ativo'
      },
      { 
        id: 2, 
        nome: 'João Analista', 
        email: 'joao@exemplo.com', 
        permissoes: ['ver dashboard', 'ver usuários'],
        status: 'ativo'
      },
      { 
        id: 3, 
        nome: 'Maria Suporte', 
        email: 'maria@exemplo.com', 
        permissoes: ['ver dashboard', 'ver perfil de outros usuários'],
        status: 'ativo'
      },
      { 
        id: 4, 
        nome: 'Carlos Gerente', 
        email: 'carlos@exemplo.com', 
        permissoes: ['ver dashboard', 'ver usuários', 'ver perfil de outros usuários'],
        status: 'ativo'
      },
      { 
        id: 5, 
        nome: 'Ana Visitante', 
        email: 'ana@exemplo.com', 
        permissoes: ['ver dashboard'],
        status: 'inativo' 
      },
      { 
        id: 6, 
        nome: 'Roberto Diretor', 
        email: 'roberto@exemplo.com', 
        permissoes: ['painel administrativo', 'ver dashboard', 'ver usuários'],
        status: 'ativo'
      },
      { 
        id: 7, 
        nome: 'Fernanda RH', 
        email: 'fernanda@exemplo.com', 
        permissoes: ['ver dashboard', 'ver usuários', 'ver perfil de outros usuários'],
        status: 'ativo' 
      },
      { 
        id: 8, 
        nome: 'Paulo Teste', 
        email: 'paulo@exemplo.com', 
        permissoes: ['ver dashboard'],
        status: 'ativo' 
      }
    ]);

    const colunas = [
      { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'left' },
      { name: 'nome', label: 'Nome', field: 'nome', sortable: true, align: 'left' },
      { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'left' },
      { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
      { name: 'permissoes', label: 'Permissões', field: 'permissoes', sortable: false, align: 'left' },
      { name: 'actions', label: 'Ações', field: 'actions', align: 'left' }
    ];

    const paginacao = ref({
      rowsPerPage: 5
    });
    
    const filtro = ref('');
    const usuarioSelecionado = ref(null);

    const usuarioAtual = computed(() => {
      if (!usuarioSelecionado.value) return { permissoes: [] };
      return usuarios.value.find(u => u.id === usuarioSelecionado.value);
    });

    const mediaPermissoesPorUsuario = computed(() => {
      const total = usuarios.value.reduce((acc, user) => acc + user.permissoes.length, 0);
      return total / usuarios.value.length;
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
      
      usuarios.value.forEach(user => {
        user.permissoes.forEach(perm => {
          contagem[perm]++;
        });
      });
      
      return contagem;
    });

    const percentualAdminUsers = computed(() => {
      const adminUsers = usuarios.value.filter(u => 
        u.permissoes.includes('painel administrativo')
      ).length;
      
      return {
        admin: adminUsers,
        naoAdmin: usuarios.value.length - adminUsers
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

    function atualizarPermissoes() {
      // Aqui você implementaria a lógica para salvar as permissões no backend
      atualizarGraficos();
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
      this.$router.push('/admin/permissoes-de-usuario')
    }

    function atualizarGraficos() {
      // Configurar gráfico de barras
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
      // Inicializar os gráficos após a montagem do componente
      setTimeout(inicializarGraficos, 100);
    });

    watch(usuarios, () => {
      atualizarGraficos();
    }, { deep: true });

    return {
      usuarios,
      colunas,
      paginacao,
      filtro,
      usuarioSelecionado,
      usuarioAtual,
      mediaPermissoesPorUsuario,
      contagemPermissoes,
      percentualAdminUsers,
      corPermissao,
      atualizarPermissoes,
      viewUser
    };
  }
});
</script>