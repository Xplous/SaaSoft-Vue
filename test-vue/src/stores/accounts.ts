// store/accounts.ts
import { defineStore } from 'pinia';

export interface Label {
    text: string;
}

export type AccountType = 'LDAP' | 'Локальная';

export interface Account {
    id: number;
    label: Label[];
    rawLabel: string;
    accountType: AccountType;
    login: string;
    password: string | null;
    isValid: boolean;
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
                password: null,
                isValid: false,
            };
            this.accounts.push(account);
        },
        updateAccount(updated: Account) {
            const index = this.accounts.findIndex(acc => acc.id === updated.id);
            if (index !== -1) {
                this.accounts[index] = updated;
            }
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
