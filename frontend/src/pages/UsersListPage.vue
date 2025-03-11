<!-- ListaUsuarios.vue -->
<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Cabeçalho -->
      <div class="col-12">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5">Listagem de Usuários</div>
            <div class="text-subtitle2">Gerencie os usuários do sistema</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Filtros -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="filtros.nome"
                  label="Filtrar por nome ou email"
                  filled
                  clearable
                  debounce="300"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append>
                    <q-icon v-if="filtros.nome" name="close" class="cursor-pointer" @click="filtros.nome = ''" />
                  </template>
                </q-input>
              </div>
              
              <div class="col-12 col-md-6">
                <q-select
                  v-model="filtros.permissao"
                  :options="opcoesPermissoes"
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
                      {{ usuariosFiltrados.length }} usuários encontrados
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tabela de Usuários -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <q-table
              :rows="usuariosFiltrados"
              :columns="colunas"
              row-key="id"
              v-model="paginacao"
              :loading="loading"
              binary-state-sort
              flat
              bordered
            >
              <!-- Avatar com Nome e Email -->
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

              <!-- Status -->
              <template v-slot:body-cell-ativo="props">
                <q-td :props="props" class="text-center">
                  <q-chip
                    :color="props.row.ativo ? 'positive' : 'negative'"
                    text-color="white"
                    dense
                    class="q-px-sm"
                  >
                    {{ props.row.ativo ? 'Ativo' : 'Inativo' }}
                  </q-chip>
                </q-td>
              </template>

              <!-- Permissões -->
              <template v-slot:body-cell-permissoes="props">
                <q-td :props="props">
                  <div class="q-gutter-xs">
                    <q-chip
                      v-for="permissao in props.row.permissoes"
                      :key="permissao"
                      :color="corPermissao(permissao)"
                      text-color="white"
                      size="sm"
                      dense
                    >
                      {{ permissaoAbreviada(permissao) }}
                    </q-chip>
                  </div>
                </q-td>
              </template>

              <!-- Ações -->
              <template v-slot:body-cell-acoes="props">
                <q-td :props="props" class="text-center">
                  <div class="q-gutter-xs">
                    <q-btn
                      flat
                      round
                      color="info"
                      icon="visibility"
                      size="sm"
                      @click="verUsuario(props.row)"
                    >
                      <q-tooltip>Ver detalhes</q-tooltip>
                    </q-btn>                      
                  </div>
                </q-td>
              </template>

              <!-- No data message -->
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

    <!-- Dialog de confirmação de exclusão -->
    <q-dialog v-model="dialogExclusao">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="text-h6 q-ml-md">Excluir Usuário</span>
        </q-card-section>

        <q-card-section v-if="usuarioSelecionado">
          Tem certeza que deseja excluir o usuário <strong>{{ usuarioSelecionado.nome }}</strong>?
          <p class="text-negative q-mb-none">Esta ação não pode ser desfeita.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Excluir" color="negative" @click="excluirUsuario" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ListaUsuarios',
  
  setup() {
    const $q = useQuasar();
    const loading = ref(false);
    const dialogExclusao = ref(false);
    const usuarioSelecionado = ref(null);
    
    // Configuração da paginação
    const paginacao = ref({
      sortBy: 'nome',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    });
    
    // Filtros
    const filtros = reactive({
      nome: '',
      permissao: null
    });
    
    // Opções de permissões para o filtro
    const opcoesPermissoes = [
      { label: 'Painel Administrativo', value: 'painel administrativo' },
      { label: 'Ver Dashboard', value: 'ver dashboard' },
      { label: 'Ver Usuários', value: 'ver usuários' },
      { label: 'Ver Perfil de Outros Usuários', value: 'ver perfil de outros usuários' }
    ];
    
    // Definição das colunas
    const colunas = [
      {
        name: 'usuario',
        required: true,
        label: 'Usuário',
        align: 'left',
        field: row => row.nome,
        sortable: true
      },
      {
        name: 'ativo',
        align: 'center',
        label: 'Status',
        field: 'ativo',
        sortable: true
      },
      {
        name: 'permissoes',
        align: 'left',
        label: 'Permissões',
        field: 'permissoes',
        sortable: false
      },
      {
        name: 'acoes',
        align: 'center',
        label: 'Ações',
        field: 'acoes',
        sortable: false
      }
    ];
    
    // Exemplo de dados de usuários
    const usuariosData = ref([
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@exemplo.com',
        imagem: null,
        ativo: true,
        permissoes: ['painel administrativo', 'ver dashboard', 'ver usuários', 'ver perfil de outros usuários']
      },
      {
        id: 2,
        nome: 'Maria Oliveira',
        email: 'maria.oliveira@exemplo.com',
        imagem: null,
        ativo: true,
        permissoes: ['ver dashboard', 'ver usuários']
      },
      {
        id: 3,
        nome: 'Pedro Santos',
        email: 'pedro.santos@exemplo.com',
        imagem: null,
        ativo: false,
        permissoes: ['ver dashboard']
      },
      {
        id: 4,
        nome: 'Ana Souza',
        email: 'ana.souza@exemplo.com',
        imagem: null,
        ativo: true,
        permissoes: ['ver dashboard', 'ver perfil de outros usuários']
      },
      {
        id: 5,
        nome: 'Carlos Ferreira',
        email: 'carlos.ferreira@exemplo.com',
        imagem: null,
        ativo: true,
        permissoes: ['painel administrativo', 'ver dashboard', 'ver usuários']
      },
      {
        id: 6,
        nome: 'Juliana Costa',
        email: 'juliana.costa@exemplo.com',
        imagem: null,
        ativo: true,
        permissoes: ['ver dashboard']
      },
      {
        id: 7,
        nome: 'Ricardo Almeida',
        email: 'ricardo.almeida@exemplo.com',
        imagem: null,
        ativo: false,
        permissoes: []
      },
      {
        id: 8,
        nome: 'Fernanda Lima',
        email: 'fernanda.lima@exemplo.com',
        imagem: null,
        ativo: true,
        permissoes: ['ver dashboard', 'ver usuários', 'ver perfil de outros usuários']
      }
    ]);
    
    // Usuários filtrados com base nos filtros aplicados
    const usuariosFiltrados = computed(() => {
      return usuariosData.value.filter(usuario => {
        // Filtro por nome ou email
        const matchNome = filtros.nome === '' || 
          usuario.nome.toLowerCase().includes(filtros.nome.toLowerCase()) ||
          usuario.email.toLowerCase().includes(filtros.nome.toLowerCase());
        
        // Filtro por permissão
        const matchPermissao = filtros.permissao === null || 
          usuario.permissoes.includes(filtros.permissao);
        
        return matchNome && matchPermissao;
      });
    });
    
    // Cores por tipo de permissão
    function corPermissao(permissao) {
      const cores = {
        'painel administrativo': 'red',
        'ver dashboard': 'green',
        'ver usuários': 'blue',
        'ver perfil de outros usuários': 'purple'
      };
      
      return cores[permissao] || 'grey';
    }
    
    // Abreviar nome da permissão para exibição em chips
    function permissaoAbreviada(permissao) {
      const abreviacoes = {
        'painel administrativo': 'Admin',
        'ver dashboard': 'Dashboard',
        'ver usuários': 'Usuários',
        'ver perfil de outros usuários': 'Perfis'
      };
      
      return abreviacoes[permissao] || permissao;
    }
    
    // Ações de usuário
    function verUsuario(usuario) {
      // Redirecionar para a página de detalhes do usuário
      console.log('Ver usuário:', usuario.id);
      $q.notify({
        message: `Visualizando ${usuario.nome}`,
        color: 'info'
      });
    }
    
    function editarUsuario(usuario) {
      // Redirecionar para a página de edição do usuário
      console.log('Editar usuário:', usuario.id);
      $q.notify({
        message: `Editando ${usuario.nome}`,
        color: 'primary'
      });
    }
    
    function confirmarExclusao(usuario) {
      usuarioSelecionado.value = usuario;
      dialogExclusao.value = true;
    }
    
    function excluirUsuario() {
      if (!usuarioSelecionado.value) return;
      
      // Simulação da exclusão
      loading.value = true;
      setTimeout(() => {
        usuariosData.value = usuariosData.value.filter(
          u => u.id !== usuarioSelecionado.value.id
        );
        
        $q.notify({
          message: `Usuário ${usuarioSelecionado.value.nome} excluído com sucesso`,
          color: 'positive'
        });
        
        usuarioSelecionado.value = null;
        loading.value = false;
      }, 1000);
    }
    
    // Simulação de carregamento inicial
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 1000);
    
    return {
      loading,
      paginacao,
      colunas,
      filtros,
      opcoesPermissoes,
      usuariosData,
      usuariosFiltrados,
      dialogExclusao,
      usuarioSelecionado,
      corPermissao,
      permissaoAbreviada,
      verUsuario,
      editarUsuario,
      confirmarExclusao,
      excluirUsuario
    };
  }
});
</script>