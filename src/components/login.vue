<template>
  <div>
    <amplify-authenticator></amplify-authenticator>
  </div>
</template>

<script>
import * as axios from "axios"
export default {
  name: 'login',
  props: {
    msg: String
  },
  data:function(){
    return {
      tag:"",
      items:[]
    }
  },
  methods:{
    onClick: function(){
      let self = this;
      axios.get(`https://pc73tz4k63.execute-api.eu-central-1.amazonaws.com/api/get/${this.tag}`).then(function(data) {
        console.log(data);
        self.items = data.data.rows;
      })
    }
  }
}
</script>