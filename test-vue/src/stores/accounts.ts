// store/accounts.ts
import { defineStore } from 'pinia';

export type AccountType = 'LDAP' | 'Локальная';

export interface Account {
    id: number;
    label: { text: string }[];
    rawLabel: string;
    accountType: AccountType;
    login: string;
    password: string;
    isValid: boolean;
    loginValid: boolean;    // Добавьте эти поля
    passwordValid: boolean;
    rawLabelValid: boolean;
}

export const useAccountsStore = defineStore('accounts', {
    state: () => ({
        accounts: [] as Account[],
        nextId: 1,
    }),
    actions: {
        addAccount() {
            const account: Account = {
                id: this.nextId++,
                label: [],
                rawLabel: '',
                accountType: 'Локальная',
                login: '',
                password: '',
                isValid: false,
                loginValid: false,
                passwordValid: false,
                rawLabelValid: false,
            };
            this.accounts.push(account);
        },
        removeAccount(id: number) {
            this.accounts = this.accounts.filter(acc => acc.id !== id);
        },
        loadFromLocalStorage() {
            const stored = localStorage.getItem('accounts');
            if (stored) {
                const data = JSON.parse(stored);
                this.accounts = data.accounts || [];
                this.nextId = data.nextId || 1;
            }
        },
        saveToLocalStorage() {
            localStorage.setItem('accounts', JSON.stringify({ accounts: this.accounts, nextId: this.nextId }));
        }
    },
});
