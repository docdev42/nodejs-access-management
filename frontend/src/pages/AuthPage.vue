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
export default {
  data() {
    return {
      tab: 'login',
      form: {
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      if (this.tab === 'register' && this.form.password !== this.form.confirmPassword) {
        this.$q.notify({ type: 'negative', message: 'As senhas não coincidem!' });
        return;
      }
      this.$q.notify({ type: 'positive', message: this.tab === 'login' ? 'Login bem-sucedido!' : 'Registro concluído!' });
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
