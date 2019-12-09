<template>
  <div>
    <button @click="btn">start</button>
    <div style="position: relative;">
      <img id='face1' src="../face_imgs/A2.jpg" alt="" width="600px">
      <canvas id="overlay"></canvas>
    </div>
  </div>
</template>

<script>
// import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js'

const { createCanvas, loadImage, createImageData } = canvas
// console.log({createCanvas, loadImage, createImageData})


export default {
  name: 'HelloWorld',
  data () {
    return {
      imgurl:""
    }
  },

  mounted(){
    this.ccc();
  },

  methods:{
    async fff(){
      // 识别人脸
      const input = document.getElementById('face1') 
      const results = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
      // const rrr = await results.withFaceLandmarks()
      console.log('results:',results)
      // 绘制
      const displaySize = { width: input.width, height: input.height } 
      const canvas = document.getElementById('overlay')
      faceapi.matchDimensions(canvas, displaySize)
      const resizedDetections = faceapi.resizeResults(results, displaySize)
      // faceapi.draw.drawDetections(canvas, resizedDetections)
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      const n = input.naturalWidth/input.width
      console.log(input.naturalWidth,input.width)
      for(var i of results){
        var box = i.detection.box
        // 配置
        const box = { x: box.x/n, y: box.y/n, width: box.width/n, height: box.height/n }
        // see DrawBoxOptions below
        const drawOptions = {
          // label: 'Hello I am a box!',
          lineWidth: 2
        }
        const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
        drawBox.draw(document.getElementById('overlay'))
      }
    },
    btn(){
      this.fff();
    },
    async ccc(){
      await faceapi.nets.ssdMobilenetv1.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights')
      await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights') // 模型
      await faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights')
      // this.fff();
      console.log('ready')
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
