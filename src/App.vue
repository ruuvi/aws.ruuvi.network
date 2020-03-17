<template>
  <div id="app">
    <amplify-sign-out></amplify-sign-out>
    <router-view/>
  </div>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth } from 'aws-amplify'
export default {
  name: 'app',
  data() {
    return {
      signedIn: false
    }
  },
  beforeCreate() {
    AmplifyEventBus.$on('authState', info => {
      if (info === 'signedIn') {
        this.signedIn = true
        this.$router.push('/')
      }
      if (info === 'signedOut') {
        this.$router.push('/login')
        this.signedIn = false
      }
    });
    Auth.currentAuthenticatedUser()
      .then(() => {
        this.signedIn = true
      })
      .catch(() => this.signedIn = false)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
