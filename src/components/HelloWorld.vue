<template>
  <div class="hello">
    <h1> Ruuvi Network with AWS </h1>
    <input type="text" v-model="tag"/><button @click="onClick()">fetch</button>
    <p>{{items.length}}</p>
    <ul>
      <li v-for="i in items" v-bind:key="i.timestamp">{{i.timestamp}} {{i.rssi}} </li>
    </ul>
  </div>
</template>

<script>
import { API } from 'aws-amplify';
export default {
  name: 'HelloWorld',
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
        self.items = response.data
      }).catch(error => {
        console.log(error.response)
      });
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
