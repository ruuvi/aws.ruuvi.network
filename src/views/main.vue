<template>
  <div>
    <h1> Ruuvi Network with AWS </h1>
    <fetch-data @tag-data="onTagData"></fetch-data>
    <line-chart-container 
      v-bind:loaded="loaded"
      v-bind:chartdata="chartdata"
      :key="tag">
    </line-chart-container>
  </div>
</template>

<script>
import { getParser } from 'ojousima.ruuvi_endpoints.ts'
var ColorHash = require('color-hash');

export default {
  name: 'Main',
  data:function(){
    return {
      loaded: false,
      chartdata: null,
      tag: ""
    }
  },
  methods: {
    hexToUnsignedInt(inputStr) {
      let hex  = inputStr.toString();
      let Uint8Array = new Array();
      for (let n = 0; n < hex.length; n += 2) {
        Uint8Array.push(parseInt(hex.substr(n, 2), 16));
      }
      return Uint8Array;
    },
    parseRuuviPayload(hexString)
    {
      hexString = hexString.toLowerCase();
      let payloadStart = hexString.search("ff9904") + 6;
      if(6 > payloadStart){
        return [0];
      }
      else {
        return this.hexToUnsignedInt(hexString.substr(payloadStart));
      }
    },
    onTagData(items, tag){
      //console.log("Received");
      // Sort by timestamp
      items.sort(function(a, b) {
        let keyA = a.timestamp;
        let keyB = b.timestamp;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      // Parse data
      let ruuviDatas = [];
      for( let i in items)
      {
        let dataString = this.parseRuuviPayload(items[i].data);
        let parser = getParser(dataString);
        let data = parser(dataString);
        data.timestamp = items[i].timestamp;
        data.rssiDB = items[i].rssi;
        // Delete properties not charted
        for ( let property in data)
        {
          if(0 == data[property]
            || null == data[property]
            || typeof data[property] === 'undefined')
          {
            delete data[property];
          }
            
          delete data["parsedAt"]
          delete data["mac"]
        }
        // Add charted data to array
        ruuviDatas.push(data);
      }
      // Format datasets for ChartJS
      let dataSets = [];
      let colorHash = new ColorHash();
      for (let property in ruuviDatas[0])
      {
          if("timestamp" == property)
          {
            continue;
          }
          let dataSet = {};
          dataSet.label = property;
          dataSet.data = ruuviDatas.map(data => ({
            y: data[property],
            t: data["timestamp"] * 1000}));
          dataSet.hidden = true;
          dataSet.borderColor = colorHash.hex(property);
          dataSet.fill = false;
          dataSets.push(dataSet);
      }
      this.chartdata = {
        datasets: dataSets
     };

      this.loaded = true;
      this.tag = tag;
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
