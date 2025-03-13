<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 100%; max-width: 400px;">
      <q-card-section>
        <q-tabs v-model="tab" class="text-primary">
          <q-tab name="login" label="Entrar" />
          <q-tab name="register" label="Registrar" />
        </q-tabs>
      </q-card-section>
      
      <q-separator />

      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-slide-transition>
            <div v-if="tab === 'register'">
              <q-input v-model="form.name" label="Nome" type="text" required filled class="q-mb-md" />
            </div>
          </q-slide-transition>

          <q-input v-model="form.email" label="E-mail" type="email" required filled />
          <q-input v-model="form.password" label="Senha" type="password" required filled class="q-mt-md" />

          <q-slide-transition>
            <div v-if="tab === 'register'">
              <q-input v-model="form.confirmPassword" label="Confirmar Senha" type="password" required filled class="q-mt-md" />
            </div>
          </q-slide-transition>

          <q-btn type="submit" color="primary" class="full-width q-mt-md">
            {{ tab === 'login' ? 'Entrar' : 'Registrar' }}
          </q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import api from 'src/services/api';
import { useQuasar } from 'quasar';
import axios from 'axios';

export default {
  data() {
    return {
      tab: 'login',
      form: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      $q: useQuasar(),
    };
  },
  methods: {
    handleSubmit() {
      if (this.tab === 'login') {
        this.login();
      } else {
        this.register();
      }
    },
    async login() {         
      await api.post('/auth/login', this.form)
      .then((res) => {
        this.setToken(res.data.access_token);

        this.$q.notify({
          type: 'positive',
          message: `Login realizado com sucesso, Bem vindo.`,
        });  
        this.$router.push('/app')
      })
      .catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Erro ao logar usuário!',
        });
      });
    },
    async register() {
      if (this.form.password !== this.form.confirmPassword) {
        return this.$q.notify({
          type: 'negative',
          message: 'Senhas devem ser iguais!',
        });
      }

      await api.post('/users', this.form)
      .then((res) => {
        this.setToken(res.data.access_token);
        this.$q.notify({
            type: 'positive',
            message: 'Cadastro realizado com sucesso! Aguarde aprovação de uma administrador.',
          });
          this.$router.push('/app')
          this.tab = 'login';
      })
      .catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Erro ao cadastrar usuário!',
        });
      });
    },
    setToken(accessToken) {
        localStorage.setItem('token', accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }
};
</script>

<style scoped>
.q-card {
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
