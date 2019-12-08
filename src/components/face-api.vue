<template>
  <div>
    <button @click="btn">dddd</button>
    <div style="position: relative;">
      <img id='face1' src="../face_imgs/A2.jpg" alt="" width="600px">
      <canvas id="overlay"></canvas>
    </div>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js'
import * as canvas from 'canvas';
// import '@tensorflow/tfjs-node';
// const { Canvas, Image, ImageData } = canvas
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

export default {
  name: 'HelloWorld',
  data () {
    return {
      imgurl:""
    }
  },
  mounted(){
        // this.fff();
      this.ccc();
  },
  methods:{
    async fff(){
      const input = document.getElementById('face1')
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
