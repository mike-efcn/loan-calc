const style = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .row {
      display: flex;
    }
    .loan {
      display: grid;
    }
    .loan input.amount {
      grid-row: 1/2;
      grid-column: 1/2;
      min-width: 50px;
    }
    .loan input.rate {
      grid-row: 1/2;
      grid-column: 2/3;
      min-width: 50px;
    }
    .loan input.period {
      grid-row: 1/2;
      grid-column: 3/4;
      min-width: 40px;
    }
    .loan .pay {
      grid-row: 1/2;
      grid-column: 4/5;
      width: 150px;
      display: flex;
      align-items: center;
    }
  `;
  document.head.appendChild(styleEl);
};

const Loan = {
  name: 'Loan',
  template: `<div class="loan">
  <input
    class="amount"
    type="number"
    placeholder="Total Loan"
    v-model="amount" @change="equalLoanPayment"
  />
  <input
    class="rate"
    type="number"
    placeholder="Annual Interest Rate"
    v-model="interest"
    @change="equalLoanPayment"
  />
  <input
    class="period"
    type="number"
    placeholder="Years"
    v-model="years"
    @change="equalLoanPayment"
  />
  <div class="pay">
    {{monthly}}
  </div>
</div>`,
  props: ['loan'],
  data() {
    return {
      amount: 100,
      interest: 3.25,
      years: 15,
      monthly: '',
    };
  },
  computed: {
    monthlyInterestRate() {
      return this.interest / 12.0 / 100.0;
    },
    months() {
      return this.years * 12.0
    },
  },
  methods: {
    equalLoanPayment() {
      this.monthly = this.amount * this.monthlyInterestRate *
        Math.pow(1.0 + this.monthlyInterestRate, this.months) /
        (Math.pow(1.0 + this.monthlyInterestRate, this.months) - 1.0)
      this.$emit('calc', { key: this.loan.key, pay: this.monthly });
    },
  },
  mounted() {
    this.equalLoanPayment();
  },
};

const App = {
  name: 'App',
  components: {
    Loan,
  },
  template: `<div>
  <button @click="addRow">+</button>
  <div class="row" v-for="loan of loans">
    <button @click="delRow(loan.key)">-</button>
    <Loan :key="loan.key" :loan="loan" @calc="calcRow" />
  </div>
  <div>{{total}}</div>
  </div>`,
  data() {
    return {
      loans: [],
    };
  },
  computed: {
    total() {
      return this.loans.reduce((acc, l) => acc + l.pay, 0);
    },
  },
  methods: {
    addRow() {
      this.loans.push({
        key: Math.random().toString(36).substr(2, 7).padEnd(7, '0'),
        pay: 0,
      });
    },
    delRow(key) {
      const rowIndex = this.loans.findIndex((r) => r.key === key);
      if (rowIndex > -1) {
        this.loans = this.loans.slice(0, rowIndex).concat(this.loans.slice(rowIndex + 1));
      }
    },
    calcRow({ key, pay }) {
      const row = this.loans.find((r) => r.key === key);
      if (row) {
        row.pay = pay;
      }
    },
  },
  mounted() {
    this.addRow();
  },
};

Promise.resolve().then(async () => {
  style();
  const $vue = new window.Vue({
    render: (h) => h(App)
  });
  window.$vue = $vue;
  $vue.$mount('#root');
});
