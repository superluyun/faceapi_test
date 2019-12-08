<template>
  <div>
    <button @click="btn">dddd</button>
    <div style="position: relative;">
      <video @onloadedmetadata="run(this)" src="" id="video" autoplay muted loop playsinline width="600px" height="336px"></video>
      <canvas id="overlay"></canvas>
    </div>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js'
import * as canvas from 'canvas';

export default {
  name: 'HelloWorld',
  data () {
    return {
      imgurl:""
    }
  },
  mounted(){
    //   
    this.run();
    
  },
  methods:{
    async fff(){
      const input = document.getElementById('video')
      const displaySize = { width: input.width, height: input.height }  
      const results = await faceapi.detectAllFaces(input,new faceapi.SsdMobilenetv1Options())
      console.log(results);
      const canvas = document.getElementById('overlay')
      faceapi.matchDimensions(canvas, displaySize)
      const resizedDetections = faceapi.resizeResults(results, displaySize)
      faceapi.draw.drawDetections(canvas, resizedDetections)
    },
    btn(){
      this.fff();
    },
    async ccc(){
      await faceapi.loadSsdMobilenetv1Model('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights')
      console.log('cc');
      this.fff();
    },
    async run() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
      const videoEl = document.getElementById('video')
      videoEl.srcObject = stream
      this.ccc();
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
  #overlay{
    position: absolute;
    top:0;
    left: 0;
  }
</style>
