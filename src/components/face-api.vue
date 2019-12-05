<template>
  <div>
    
  </div>
</template>

<script>
import * as faceapi from 'face-api.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      
    }
  },
  mounted(){
    console.log(faceapi.nets)
  }
}
</script>


<style scoped>

</style>
