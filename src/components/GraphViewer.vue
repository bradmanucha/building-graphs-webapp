<template>
  <div id="3d-graph" style="height: 500px !important">

  </div> 
</template>

<script setup>
import ForceGraph3D from '3d-force-graph';
import { onMounted } from 'vue'

onMounted(() => {
  const Graph = ForceGraph3D()(document.getElementById('3d-graph'))
    .jsonUrl('/miserables.json')
    .nodeLabel('id')
    .nodeAutoColorBy('group')
})
</script>

<style scoped>

</style>
