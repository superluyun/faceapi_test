<template>
  <div style="width:70%;margin:0 auto">
    <button @click="btn">start</button>
    <div style="position: relative; float:left">
      <img id='face1' src="../face_imgs/Avengers2.jpg" alt="" width="600px">
      <canvas id="overlay"></canvas>
    </div>
    <div style="float:right">
      <img id='face' src="" alt="">
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
  name: 'face_api',
  data () {
    return {
      imgurl:"",
      dis_list:[]
    }
  },

  mounted(){
    this.ccc();
  },

  methods:{
    async fff(){
      // 识别人脸
      const that = this
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

      // 计算最小距离
      var dis_list = this.faceDis(results,input)
      var min_dis = Math.min(...dis_list)
      
      for(var i of results){
        var ori_box = i.detection.box
        // 配置
        const box = { x: ori_box.x/n, y: ori_box.y/n, width: ori_box.width/n, height: ori_box.height/n }
        // see DrawBoxOptions below
        const drawOptions = {
          // label:
          lineWidth: 2
        }
        // 距中心点距离
        var img_centre = {x:0,y:0}  //屏幕中心点
        img_centre.x = input.width/2;
        img_centre.y = input.height/2;
        var dis = Math.sqrt(Math.pow((box.x+box.width/2) - img_centre.x,2) + Math.pow((box.y+box.height/2) - img_centre.y,2));   //距中心点距离
        if(dis === min_dis){
          const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
          drawBox.draw(document.getElementById('overlay'))

          const regionsToExtract = [
            new faceapi.Rect(ori_box.x, ori_box.y , ori_box.width, ori_box.height)
            // new faceapi.Rect(0, 0, 100, 100)
          ]
          const canvases = await faceapi.extractFaces(input, regionsToExtract)
          console.log(canvases)
          var img = new Image()
          var src = canvases[0].toDataURL("image/png")
          document.getElementById('face').src = src
          
        }
      }
      
    },
    btn(){
      this.fff();
    },
    //计算人脸距中心点距离
    faceDis(results,input){
      var dis_list = []
      for(var i of results){
        var box = i.detection.box
        // 配置
        const n = input.naturalWidth/input.width
        const box = { x: box.x/n, y: box.y/n, width: box.width/n, height: box.height/n }
        const drawOptions = {
          // label: 
          lineWidth: 2
        }
        // 距中心点距离
        var img_centre = {x:0,y:0}  //屏幕中心点
        img_centre.x = input.width/2;
        img_centre.y = input.height/2;
        var dis = Math.sqrt(Math.pow((box.x+box.width/2) - img_centre.x,2) + Math.pow((box.y+box.height/2) - img_centre.y,2));   //距中心点距离
        dis_list.push(dis)
      }
      return dis_list
    },
    async ccc(){
      let url = 'models'
      // 训练模型
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/static/'+url)
      await faceapi.nets.faceLandmark68Net.loadFromUri('/static/'+url) 
      await faceapi.nets.faceRecognitionNet.loadFromUri('/static/'+url)
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
