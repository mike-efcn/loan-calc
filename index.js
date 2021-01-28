const App = {
  template: `<div>
  <input type="number" placeholder="Total Loan" v-model="loan" @change="equalLoanPayment" />
  <input type="number" placeholder="Annual Interest Rate" v-model="interest" @change="equalLoanPayment" />
  <input type="number" placeholder="Year" v-model="years" @change="equalLoanPayment" />
  <div>{{monthly}}</div>
  </div>`,
  data() {
    return {
      loan: 100,
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
      this.monthly = this.loan * this.monthlyInterestRate *
        Math.pow(1.0 + this.monthlyInterestRate, this.months) /
        (Math.pow(1.0 + this.monthlyInterestRate, this.months) - 1.0)
    },
  },
};

Promise.resolve().then(async () => {
  const $vue = new window.Vue({
    render: (h) => h(App)
  });
  window.$vue = $vue;
  $vue.$mount('#root');
});
