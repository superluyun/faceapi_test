<template>
  <div style="width:70%;margin:0 auto">
    <button @click="btn">start</button>
    <input type="radio" value="" :checked=isTiny @click="isTiny=true"> tiny 
    <input type="radio" value="" :checked=!isTiny @click="isTiny=false"> ssd 
    <div style="position: relative; float:left">
      <img id='face1' src="../face_imgs/bbt1.jpg" alt="" width="600px">
      <canvas id="overlay"></canvas>
    </div>
  </div>
</template>

<script>

import * as canvas from 'canvas';
import * as faceapi from 'face-api.js'
const { createCanvas, loadImage, createImageData } = canvas


export default {
  name: 'tiny_face',
  data () {
    return {
      imgurl:"",
      dis_list:[],
      isTiny:true,
    }
  },

  mounted(){
    this.loadmodel();
  },
  watch:{
    isTiny:function(v,ov){
      this.loadmodel();
    }
  },  
  methods:{
    async loadmodel(){
        this.isTiny
        ?await faceapi.loadTinyFaceDetectorModel('/static/models')
        :await faceapi.loadSsdMobilenetv1Model('/static/models')
        console.log('ok')
    },
    async detectFace(){
         const input = document.getElementById('face1')
         const detections = this.isTiny
         ? await faceapi.detectAllFaces(input,new faceapi.TinyFaceDetectorOptions({inputSize:480,scoreThreshold:0.5}))
         : await faceapi.detectAllFaces(input,new faceapi.SsdMobilenetv1Options())
         console.log(detections)
     },
    btn(){
        this.detectFace()
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
