<template>
  <div>
    <h1> Ruuvi Network with AWS </h1>
    <fetch-data @tag-data="onTagData"></fetch-data>
    <line-chart-container 
      v-bind:loaded="loaded"
      v-bind:chartdata="chartdata">
    </line-chart-container>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data:function(){
    return {
      loaded: false,
      chartdata: null
    }
  },
  methods: {
    onTagData(items){
      console.log("Received");
      items.sort(function(a, b) {
        let keyA = a.timestamp;
        let keyB = b.timestamp;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      let datapoints = items.map(item => ({
        t: new Date(item.timestamp * 1000), 
        y: item.rssi})
      );
      this.chartdata = {
      datasets: [
        {
          label: 'rssi',
          backgroundColor: '#f87979',
          data: datapoints
        }
      ]
     };

      this.loaded = true;
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
