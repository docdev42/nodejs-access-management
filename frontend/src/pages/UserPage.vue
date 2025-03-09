<!-- PerfilUsuario.vue -->
<template>
  <q-page padding>
    <div class="row q-col-gutter-md justify-center">
      <!-- Cabeçalho -->
      <div class="col-12 col-md-8">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5">Perfil de Usuário</div>
            <div class="text-subtitle2">Gerencie suas informações pessoais</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card>
          <q-tabs
            v-model="tab"
            class="text-primary"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="visualizar" icon="visibility" label="Visualizar" />
            <q-tab name="editar" icon="edit" label="Editar" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- Painel de visualização -->
            <q-tab-panel name="visualizar">
              <div class="row q-col-gutter-md">
                <!-- Coluna da foto de perfil e status -->
                <div class="col-12 col-md-4 q-gutter-y-md">
                  <div class="text-center">
                    <q-avatar size="150px" class="q-mb-md">
                      <img :src="usuario.imagem || '/api/placeholder/150/150'" />
                      <q-badge 
                        floating 
                        rounded 
                        :color="usuario.ativo ? 'positive' : 'negative'"
                        class="q-px-sm"
                      >
                        {{ usuario.ativo ? 'Ativo' : 'Inativo' }}
                      </q-badge>
                    </q-avatar>
                  </div>
                  
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Status da Conta</div>
                      <q-chip
                        :color="usuario.ativo ? 'green' : 'red'"
                        text-color="white"
                        icon="circle"
                      >
                        {{ usuario.ativo ? 'Ativo' : 'Inativo' }}
                      </q-chip>
                    </q-card-section>
                  </q-card>
                  
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Informações de Login</div>
                      <q-list dense>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Último acesso</q-item-label>
                            <q-item-label>{{ formatDate(usuario.ultimoAcesso) }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Conta criada em</q-item-label>
                            <q-item-label>{{ formatDate(usuario.dataCriacao) }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </div>
                
                <div class="col-12 col-md-8">
                  <q-card flat bordered class="q-mb-md">
                    <q-card-section>
                      <div class="text-h6">Informações Pessoais</div>
                    </q-card-section>
                    
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Nome</q-item-label>
                          <q-item-label>{{ usuario.nome }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Email</q-item-label>
                          <q-item-label>{{ usuario.email }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Data de Nascimento</q-item-label>
                          <q-item-label>{{ formatDate(usuario.dataNascimento) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                  
                  <!-- Permissões do usuário -->
                  <q-card flat bordered class="q-mb-md">
                    <q-card-section>
                      <div class="text-h6">Permissões</div>
                    </q-card-section>
                    
                    <q-card-section>
                      <div class="q-gutter-sm">
                        <q-chip
                          v-for="permissao in usuario.permissoes"
                          :key="permissao"
                          :color="corPermissao(permissao)"
                          text-color="white"
                          icon="verified_user"
                        >
                          {{ permissao }}
                        </q-chip>
                        <div v-if="usuario.permissoes.length === 0" class="text-grey">
                          Usuário não possui permissões.
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                  
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Sobre</div>
                    </q-card-section>
                    
                    <q-card-section>
                      <p v-if="usuario.descricao">{{ usuario.descricao }}</p>
                      <p v-else class="text-grey">Nenhuma descrição fornecida.</p>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
            
            <!-- Painel de edição -->
            <q-tab-panel name="editar">
              <q-form @submit="salvarPerfil" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <!-- Coluna da foto e status -->
                  <div class="col-12 col-md-4">
                    <div class="text-center">
                      <q-avatar size="150px" class="q-mb-sm">
                        <img :src="formUsuario.imagem || '/api/placeholder/150/150'" />
                      </q-avatar>
                      
                      <div class="q-gutter-sm">
                        <q-btn size="sm" color="primary" label="Upload" icon="cloud_upload" />
                        <q-btn size="sm" color="negative" label="Remover" icon="delete" @click="removerImagem" />
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-md-8">
                    <q-input
                      v-model="formUsuario.nome"
                      label="Nome completo *"
                      filled
                      :rules="[val => !!val || 'Nome é obrigatório']"
                    />
                    
                    <q-input
                      v-model="formUsuario.email"
                      label="Email *"
                      filled
                      type="email"
                      :rules="[
                        val => !!val || 'Email é obrigatório',
                        val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(val) || 'Email inválido'
                      ]"
                    />
                    
                    <q-input
                      class="q-mb-md"
                      v-model="formUsuario.dataNascimento"
                      label="Data de Nascimento"
                      filled
                      mask="##/##/####"
                      placeholder="DD/MM/AAAA"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date
                              v-model="formUsuario.dataNascimento"
                              mask="DD/MM/YYYY"
                              today-btn
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    
                    <q-input
                      v-model="formUsuario.descricao"
                      label="Descrição"
                      type="textarea"
                      filled
                      autogrow
                      hint="Uma breve descrição sobre você"
                    />
                    
                    <div class="row justify-end q-mt-md">
                      <q-btn label="Cancelar" color="grey" flat class="q-mr-sm" @click="tab = 'visualizar'" />
                      <q-btn label="Salvar" type="submit" color="primary" />
                    </div>
                  </div>
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { date } from 'quasar';

export default defineComponent({
  name: 'PerfilUsuario',
  
  setup() {
    const $q = useQuasar();
    const tab = ref('visualizar');
    
    // Dados de exemplo do usuário
    const usuario = reactive({
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@exemplo.com',
      dataNascimento: '1990-05-15',
      imagem: null, // URL da imagem, null para usar placeholder
      ativo: true,
      descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl eget aliquam aliquam, nunc nunc aliquet nunc, vitae aliquam nisl nunc eget nisl.',
      ultimoAcesso: '2025-03-05T14:30:00',
      dataCriacao: '2023-10-10T09:45:00',
      permissoes: ['ver dashboard', 'ver usuários', 'ver perfil de outros usuários']
    });
    
    // Clone para o formulário
    const formUsuario = reactive({ 
      ...usuario,
      permissoes: [...usuario.permissoes] // Clone do array para evitar referência
    });
    
    // Função para formatar data
    function formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      
      try {
        if (dateStr.includes('T')) {
          // ISO datetime string
          return date.formatDate(dateStr, 'DD/MM/YYYY HH:mm');
        } else {
          // Only date
          return date.formatDate(dateStr, 'DD/MM/YYYY');
        }
      } catch (e) {
        console.log(e)
        return dateStr;
      }
    }
    
    // Obter a cor para cada permissão
    function corPermissao(permissao) {
      const cores = {
        'painel administrativo': 'red',
        'ver dashboard': 'green',
        'ver usuários': 'blue',
        'ver perfil de outros usuários': 'purple'
      };
      
      return cores[permissao] || 'grey';
    }
    
    // Remover imagem de perfil
    function removerImagem() {
      formUsuario.imagem = null;
      $q.notify({
        color: 'info',
        message: 'Imagem removida. Salve para confirmar.',
        icon: 'info'
      });
    }
    
    // Salvar alterações no perfil
    function salvarPerfil() {
      // Simular uma requisição de API
      $q.loading.show({
        message: 'Salvando alterações...'
      });
      
      // Simular um delay de resposta
      setTimeout(() => {
        // Atualizar objeto principal com os dados do formulário
        Object.assign(usuario, {
          ...formUsuario,
          permissoes: [...formUsuario.permissoes] // Clone para evitar referência
        });
        
        $q.loading.hide();
        $q.notify({
          color: 'positive',
          message: 'Perfil atualizado com sucesso!',
          icon: 'check_circle'
        });
        
        tab.value = 'visualizar';
      }, 1000);
    }
    
    return {
      tab,
      usuario,
      formUsuario,
      formatDate,
      corPermissao,
      removerImagem,
      salvarPerfil
    };
  }
});
</script>