import Vue from 'vue'
import App from './App.vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from './aws-exports'
import router from './router'
import FetchData from './components/fetchdata'
import LineChartContainer from './components/chartcontainer'

Amplify.configure(awsconfig)

Vue.use(AmplifyPlugin, AmplifyModules)
Vue.config.productionTip = false

Vue.component('fetch-data', FetchData);
Vue.component('line-chart-container', LineChartContainer);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
