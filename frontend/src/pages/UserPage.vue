<template>
  <q-page padding>
    <div class="row q-col-gutter-md justify-center">

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
            <q-tab-panel name="visualizar">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4 q-gutter-y-md">
                  <div class="text-center">
                    <q-avatar size="150px" class="q-mb-md">
                      <img :src="user.imagem" />                      
                    </q-avatar>
                  </div>
                  
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Status da Conta</div>
                      <q-chip
                        :color="user.approved ? 'green' : 'red'"
                        text-color="white"
                      >
                        {{ user.approved ? 'Aprovado' : 'Não aprovado' }}
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
                            <q-item-label>{{ user.lastLoginAt ? date.formatDate(user.lastLoginAt, 'DD/MM/YYYY HH:mm') : '-' }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Conta criada em</q-item-label>
                            <q-item-label>{{ date.formatDate(user.createdAt, 'DD/MM/YYYY HH:mm') }}</q-item-label>
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
                          <q-item-label>{{ user.name }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Email</q-item-label>
                          <q-item-label>{{ user.email }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Data de Nascimento</q-item-label>
                          <q-item-label>{{ user.birthday ? date.formatDate(user.birthday, 'DD/MM/YYYY') : '-' }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                  
                  <q-card flat bordered class="q-mb-md">
                    <q-card-section>
                      <div class="text-h6">Permissões</div>
                    </q-card-section>
                    
                    <q-card-section>
                      <div class="q-gutter-sm">
                        <q-chip
                          v-for="permission in user.permissions"
                          :key="permission"
                          :style="{ backgroundColor: stringToColor(permission.name), color: 'white' }"
                          text-color="white"
                        >
                          {{ permission.name }}
                        </q-chip>
                        <div v-if="user.permissions === 0" class="text-grey">
                          Usuário não possui permissões.
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>                  
                </div>
              </div>
            </q-tab-panel>                  
            
            <q-tab-panel name="editar">
              <q-form @submit="updateUser" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-4">
                    <div class="text-center">
                      <q-avatar size="150px" class="q-mb-sm">
                        <img :src="userForm.imagem || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
                      </q-avatar>

                      <div class="q-gutter-sm">
                        <q-btn 
                          size="sm" 
                          color="primary" 
                          label="Upload" 
                          icon="cloud_upload"
                          @click="triggerFileInput" 
                        />
                        <input 
                          type="file" 
                          ref="fileInput"
                          accept="image/*" 
                          style="display: none" 
                          @change="onFileSelected"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-md-8">
                    <q-input
                      v-model="userForm.name"
                      label="Nome completo *"
                      filled
                      :rules="[val => !!val || 'Nome é obrigatório']"
                    />
                    
                    <q-input
                      v-model="userForm.email"
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
                      v-model="birthday"
                      label="Data de Nascimento"
                      filled
                      mask="##/##/####"
                      placeholder="DD/MM/AAAA"
                      readonly
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date
                              v-model="birthday"
                              mask="DD/MM/YYYY"
                              today-btn
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    
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
import { defineComponent, ref, onMounted, reactive, computed } from 'vue';
import { date } from 'quasar';
import api from 'src/services/api';
import { useRoute } from 'vue-router';
import { useColor } from 'src/composables/useColor';
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'UserPage',
  
  setup() {
    const $q = useQuasar();
    const fileInput = ref(null);
    const tab = ref('visualizar');
    const route = useRoute();
    const userId = route.params.id;
    const { stringToColor } = useColor();
    let user = ref({});
    let userForm = reactive(user);

    onMounted(() => {
      loadUser();
    });

    const birthday = computed({      
      get() {
        return userForm.value.birthday;
      },
      set(date) {     
        userForm.value.birthday = date;
      }
    });

    async function loadUser() {
      await api.get(`users/${userId}`).then((res) => {
        user.value = res.data;
      }).catch((err) => {
        $q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Erro ao carregar informações do usuário',
        });
      });
    }

    function triggerFileInput() {
      fileInput.value.click();
    };

    function onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.includes('image/')) {
          alert('Por favor, selecione apenas arquivos de imagem.');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          user.value.imagem = e.target.result;
        };
        reader.readAsDataURL(file);
      }     
    };

    async function updateUser() {
      const parsedDate = date.extractDate(userForm.value.birthday, 'DD/MM/YYYY')   
      await api.patch(`users/${userId}`, {
        name: userForm.value.name,
        email: userForm.value.email,
        birthday: date.formatDate(parsedDate)
      }).then((res) => {
        user.value = res.data  
        console.log(res.data)
        $q.notify({
          color: 'positive',
          message: 'Dados atualizados com sucesso!'
        });

      tab.value = 'visualizar';

      }).catch((err) => {
        console.log(err)
        $q.notify({
          color: 'negative',
          message: `Falha ao atualizar os dados: ${err.message}`
        });
      })          
    };
    
    return {
      tab,
      $q,
      userForm,
      updateUser,
      stringToColor,
      user,
      date,
      triggerFileInput,
      onFileSelected,
      fileInput,
      birthday,
    };
  }
});
</script>