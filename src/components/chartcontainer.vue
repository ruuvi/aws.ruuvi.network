<template>
  <div class="container">
    <line-chart
      v-if="loaded"
      :chartdata="chartdata"
      :options="options"
      />
  </div>
</template>

<script>
import LineChart from './chart'

export default {
  name: 'LineChartContainer',
  components: { LineChart },
  props: {
    loaded: Boolean,
    chartdata: Object
  },
  data(){
    return {
      options: {
        responsive:true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'linear',
            time: {
              displayFormats: {
                quarter: 'MMM YYYY'
              }
            }
          }]
        }
      }
    } 
  }
}
</script>

<style>
</style>