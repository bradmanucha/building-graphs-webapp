<template>
  <div id="3d-graph"></div> 
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

  let graphDiv = document.getElementById('3d-graph')

  const Graph = new ForceGraph3D(graphDiv)
    .graphData(formattedGraphJson)
    .nodeLabel('nodeLabel')
    .nodeAutoColorBy('IfcType')
})
</script>

<style scoped>

</style>
