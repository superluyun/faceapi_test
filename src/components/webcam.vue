<template>
  <div>
    <!-- <button @click="btn">start</button> -->
    <div style="position: relative;">
      <video @onloadedmetadata="run(this)" src="" id="video" autoplay muted loop playsinline width="450px" height="336"></video>
      <canvas id="overlay"></canvas>
    </div>
    <img id="face_img" src="" alt="" width="128px">
  </div>
</template>

<script>
import * as faceapi from 'face-api.js'
import * as canvas from 'canvas'
import { rsqrt } from '@tensorflow/tfjs-core';

export default {
  name: 'HelloWorld',
  data () {
    return {
      imgurl:""
    }
  },
  mounted(){
    //
    // setInterval(()=>{this.run()} ,100);   
    this.run();
    
  },
  methods:{
    async fff(){
      const input = document.getElementById('video')
      if(input.paused || input.ended)
        return setTimeout(() => this.fff())
      const displaySize = { width: input.width, height: input.height }  
      const results = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions({inputSize:224},{scoreThreshold:0.7}))
      // console.log(results)
      const canvas = document.getElementById('overlay')
      if(results){
        faceapi.matchDimensions(canvas, displaySize)
        const resizedDetections = faceapi.resizeResults(results, displaySize)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        //截图
        const canvases = await faceapi.extractFaces(input, results)
        var img_face = document.getElementById('face_img')
        // input.pause();
        for(var i of canvases){
          var img = new Image();
          img_face.src = i.toDataURL('image/png')
        }
        
        // console.log(canvases);
      }
      setTimeout(()=>{
        this.fff()
      })
    },
    btn(){
      const input = document.getElementById('video')
      input.play();
      this.fff();
    },
    async ccc(){
      await faceapi.loadTinyFaceDetectorModel('/static/models')
      console.log('ready');
      this.fff();

    },
    async run() {
      this.ccc();
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
      const videoEl = document.getElementById('video')
      videoEl.srcObject = stream
      
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
