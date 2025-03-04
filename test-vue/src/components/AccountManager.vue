<template>
  <div class="mx-auto max-w-3xl py-8">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-bold">Учетные записи</h2>
      <Button
          class="inline-flex h-10 w-10 items-center rounded-xl justify-center bg-primary text-primary-foreground text-xl hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          @click="addAccount"
      >
        +
      </Button>
    </div>
    <p class="mb-6 text-sm text-muted-foreground">
      Для указания нескольких меток для одной пары логин/пароль используйте
      разделитель <strong>;</strong>
    </p>
    <div class="space-y-4">
      <div
          v-for="account in accountsStore.accounts"
          :key="account.id"
          class="rounded-lg border bg-card shadow-sm p-4"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex flex-col">
            <Label class="mb-1 text-sm font-medium">Метки</Label>
            <Input
                type="text"
                v-model="account.rawLabel"
                @blur="onLabelBlur(account)"
                @input="validateAccount(account)"
                placeholder="Например: 'XXX; YYY'"
                class="rounded-xl"
            />
          </div>
          <div class="flex flex-col">
            <Label class="mb-1 text-sm font-medium">Тип записи</Label>
            <Select
                v-model="account.accountType"
                @update:modelValue="onAccountTypeChange(account)"
                @change="onAccountTypeChange(account)"
            >
              <SelectTrigger class="rounded-xl border-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent class="bg-white">
                <SelectItem value="LDAP">LDAP</SelectItem>
                <SelectItem value="Локальная">Локальная</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex flex-col">
            <Label class="mb-1 text-sm font-medium">Логин</Label>
            <Input
                type="text"
                v-model="account.login"
                @blur="onLoginBlur(account)"
                @input="validateAccount(account)"
                maxlength="100"
                placeholder="Введите логин"
                class="rounded-xl"
            />
          </div>
        </div>
        <div v-if="account.accountType === 'Локальная'" class="mt-4 flex flex-col">
          <Label class="mb-1 text-sm font-medium">Пароль</Label>
          <Input
              type="password"
              v-model="account.password"
              @blur="onPasswordBlur(account)"
              @input="validateAccount(account)"
              placeholder="Введите пароль"
              class="rounded-xl"
          />
        </div>
        <div class="mt-4 flex justify-end">
          <Button @click="removeAccount(account.id)" class="rounded-xl">Удалить</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useAccountsStore } from '../stores/accounts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Account } from '../stores/accounts';
import {Input} from "@/components/ui/input";

export default defineComponent({
  name: 'AccountManager',
  components: { Input, Label, Button, Select, SelectItem, SelectContent, SelectTrigger, SelectValue },
  setup() {
    const accountsStore = useAccountsStore();
    accountsStore.loadFromLocalStorage();

    accountsStore.accounts.forEach(account => {
      account.rawLabel = account.rawLabel ?? '';
      account.accountType = account.accountType ?? '';
      account.login = account.login ?? '';
      account.password = account.password ?? ''; // Избавляемся от null
    });

    const validateAccount = (account: Account) => {
      const loginValid = account.login.trim().length <= 100;
      const passwordValid = account.accountType === 'LDAP' || (account.password?.length ?? 0) <= 100;
      const labelValid = account.rawLabel.trim().length <= 50;

      account.loginValid = loginValid;
      account.passwordValid = passwordValid;
      account.rawLabelValid = labelValid;
      account.isValid = loginValid && passwordValid && labelValid;
    };

    const onLabelBlur = (account: Account) => {
      account.label = account.rawLabel.split(';').map(text => ({ text: text.trim() })).filter(item => item.text);
      validateAccount(account);
      accountsStore.saveToLocalStorage();
    };

    const onLoginBlur = (account: Account) => {
      validateAccount(account);
      accountsStore.saveToLocalStorage();
    };

    const onPasswordBlur = (account: Account) => {
      validateAccount(account);
      accountsStore.saveToLocalStorage();
    };

    const onAccountTypeChange = (account: Account) => {
      if (account.accountType === 'LDAP') {
        account.password = '';
      }
      validateAccount(account);
      accountsStore.saveToLocalStorage();
    };

    const addAccount = () => {
      accountsStore.addAccount();
      accountsStore.saveToLocalStorage();
    };

    const removeAccount = (id: number) => {
      accountsStore.removeAccount(id);
      accountsStore.saveToLocalStorage();
    };

    watch(
        () => accountsStore.accounts,
        (accounts) => accounts.forEach(validateAccount),
        { deep: true }
    );

    return { accountsStore, addAccount, removeAccount, onLabelBlur, onLoginBlur, onPasswordBlur, onAccountTypeChange, validateAccount };
  },
});
</script>