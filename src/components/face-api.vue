<template>
  <div>
    <button @click="btn">dddd</button>
    <img id='face1' src="../face_imgs/timg.jpg" alt="" width="200px" height="263.906">
    <canvas id="overlay"></canvas>
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
        // this.fff();
      this.ccc();
  },
  methods:{
    async fff(){
      const inputImgEl = document.getElementById('face1')
      const displaySize = { width: inputImgEl.width, height: inputImgEl.height }  
      const results =await faceapi.detectAllFaces(inputImgEl)
      console.log(results);
      const canvas = document.getElementById('overlay')
      faceapi.matchDimensions(canvas, displaySize)
      const resizedDetections = faceapi.resizeResults(results, displaySize)
      console.log(resizedDetections);
      faceapi.draw.drawDetections(canvas, resizedDetections)
    },
    btn(){
      this.fff();
      console.log('cc');
    },
    async ccc(){
      await faceapi.nets.ssdMobilenetv1.load('./src/assets/weights')
    },
    getFaceDetectorOptions() {
      const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
      let selectedFaceDetector = SSD_MOBILENETV1

      // ssd_mobilenetv1 options
      let minConfidence = 0.5

      // tiny_face_detector options
      let inputSize = 512
      let scoreThreshold = 0.5

      //mtcnn options
      let minFaceSize = 20

      return selectedFaceDetector === SSD_MOBILENETV1
        ? new faceapi.SsdMobilenetv1Options({ minConfidence })
        : (
          selectedFaceDetector === TINY_FACE_DETECTOR
            ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
            : new faceapi.MtcnnOptions({ minFaceSize })
        )
    }
  }
}
</script>


<style scoped>

</style>
