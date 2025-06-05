<template>
  <div id="3d-graph" style="height: 500px !important">

  </div> 
</template>

<script setup>
import ForceGraph3D from '3d-force-graph';
import { onMounted } from 'vue'
import {convertToGraphFormat} from "@/utils/index"
import {useStore} from '@/stores/store'

onMounted(async () => {
  const store = useStore()
  const [nodesRes, edgesRes] = await Promise.all([
      fetch('/nodes.json'),
      fetch('/edges.json')
    ]);

  const nodeData = await nodesRes.json();
  const edgeData = await edgesRes.json();
  
  let formattedGraphJson = convertToGraphFormat(nodeData, edgeData)
  store.graphJSON = formattedGraphJson

  const Graph = ForceGraph3D()(document.getElementById('3d-graph'))
    .graphData(formattedGraphJson)
    .nodeLabel('nodeLabel')
    .nodeAutoColorBy('IfcType')
})
</script>

<style scoped>

</style>
