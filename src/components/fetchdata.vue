<template>
  <div>
    <input type="text" v-model="tag"/><button @click="onClick()">fetch</button> 
    Datapoints: {{items.length}}
  </div>
</template>

<script>

import { API } from 'aws-amplify';

export default {
  name: 'FetchData',
  data:function(){
    return {
      tag:"",
      items:[]
    }
  },
  methods:{
    onClick: function(){
      let self = this;
      let apiName = 'ruuvinetworkapi';
      let path = `/get/${this.tag}`;
      let myInit = { // OPTIONAL
        headers: {}, // OPTIONAL
        response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
        /*
        queryStringParameters: {  // OPTIONAL
          name: 'param'
        }*/
      }
      API.get(apiName, path, myInit).then(response => {
        console.log(response);
        self.items = response.data;
        this.emitGlobalDataEvent();

      }).catch(error => {
        console.log(error);
      });
    },
    // Let other components receive the data
    emitGlobalDataEvent() {
      console.log("Emit");
      this.$emit('tag-data', this.items);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
