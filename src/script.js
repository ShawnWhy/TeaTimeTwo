import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {SphereGeometry, TextureLoader , CubeTextureLoader} from 'three'
import CANNON from 'cannon'
import $ from "./Jquery"
import gsap from "gsap";
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
const about = "<p>Shawn Is a person</p>"
const contact = "<div><a href='mailto:shawnyudesign@gmail.com'>shawnyudesign@gmail.com</a></div>"
const portfolio = '<div><ul><li><a href="https://shawnwhy.github.io/Cosmotree/">Cosmo Tree</a></li> <li><a href="https://shawnwhy.github.io/CloudySky/">Sky Over Berlin</a></li><li><a href="https://shawnwhy.github.io/CandieEater/">Diary of a Candy Eater</a></div>'
const news = "<p>Under Construction</p>"
const textureLoader = new THREE.TextureLoader()
var audioCup = new Audio('/mug.wav');
var audioClick = new Audio('/click.wav');
audioCup.volume=.5
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
const portfolioButton=document.getElementsByClassName("portfolio");
const aboutButton = document.getElementsByClassName("about")
const  contactButton = document.getElementsByClassName("contact")
const  newsButton = document.getElementsByClassName("news")
//raycaster
const objectsToUpdate = []
// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 8, 8)
//global variables
let intersects=null
let dance="off"
let singleSet = null
let tableCloth = null
let mixer = null
let teaset = null
let singleCup= null
let singlePlate = null
let singleGroup = null
let cups ={
    1:"",
    2:"",
    3:"",
    4:"",
    5:"",
    6:"",
}
let plates ={
    1:"",
    2:"",
    3:"",
    4:"",
    5:"",
    6:"",
}


let teaSetTriggers={
1:"on",
2:"on",
3:"on",
4:"on",
5:"on",
6:"on",
"rack":"on"

}

const quotes = [
    "Words bounce. Words, if you let them, will do what they want to do and what they have to do.",
    

]

let singleSetDisplay = "off"

 const basicTexture = new THREE.MeshBasicMaterial({color:"blue"})


 const world = new CANNON.World()
 world.broadphase = new CANNON.SAPBroadphase(world)
 world.allowSleep = true
 world.gravity.set(0, - 9.82, 0)
 
 const defaultMaterial = new CANNON.Material('default')
 const defaultContactMaterial = new CANNON.ContactMaterial(
     defaultMaterial,
     defaultMaterial,
     {
         friction: .3,
         restitution: 0.001
     }
 )
 world.addContactMaterial(defaultContactMaterial)

const createSingleSet = function(){
    const cupbow = new CANNON.Cylinder(.14,.1,.14,8)
    const plateDrop = new CANNON.Cylinder(.3,.15,.05,8)

    const cupHandle = new CANNON.Cylinder(.1,.1,.01,8)
    // cupHandle.quaternion.setClearColor(new CANNON.Vec3())
    
    const cupbody = new CANNON.Body({mass:1})
    const platebody = new CANNON.Body({mass:1})
    cupbody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0),Math.PI *0.5)
    platebody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0),Math.PI *0.5)
    cupbody.position=new CANNON.Vec3(intersects[0].point.x, 1, intersects[0].point.z)
    platebody.position=new CANNON.Vec3(intersects[0].point.x, .9, intersects[0].point.z)

    cupbody.material=defaultMaterial;
    cupbody.addShape(cupbow,new CANNON.Vec3(0,0,0))
    cupbody.addShape(cupHandle,new CANNON.Vec3(.115,0,0))
    platebody.addShape(plateDrop,new CANNON.Vec3(0,0,0))

    // cupbody.addShape(cupHandle,new CANNON.Vec3(-.5,0,0),new CANNON.Quaternion(Math.PI*2,0,0))

    const cupbowFakeGeo = new THREE.CylinderGeometry(.14,.1,.14,8,3,false,0,Math.PI*2)
    const cuphandleFakeGeo = new THREE.CylinderGeometry(.1,.1,.01,8,2,false,0,Math.PI*2)
    const plateFakeGeo = new THREE.CylinderGeometry(.3,.15,.05,8,3,false,0,Math.PI*2)

    const singleplateMesh = new THREE.Mesh(plateFakeGeo, plateMaterial2)
    const handleBowMesh = new THREE.Mesh(cuphandleFakeGeo, plateMaterial2)
    handleBowMesh.position.x =-.115

    const singleFakeCup = new THREE.Group()
    singleplateMesh.rotation.x =  Math.PI * 0.5
    const singleCup= singleGroup.children[1].clone()
    const newsingleplate= singleGroup.children[0].clone()
    newsingleplate.rotation.x =  Math.PI * 0.5

    singleCup.rotation.x +=  Math.PI * 0.5
    // singleCup.position.x -=.2
    singleFakeCup.add(singleCup)
    const plateMesh = new THREE.Group();
    plateMesh.add(newsingleplate)
    // console.log(singleGroup)

    world.add(platebody)
    scene.add(plateMesh)
    world.addBody(cupbody)
    scene.add(singleFakeCup)
    objectsToUpdate.push({singleFakeCup,cupbody,plateMesh,platebody})
    

}

 //physics floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.position=new CANNON.Vec3(0, .1, 0)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI *0.5
)
floorBody.addShape(floorShape)

world.addBody(floorBody)
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
 basicTexture
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = -.5
scene.add(floor)
floor.position.copy(floorBody.position)


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if(sizes.width>860){
        camera.position.set(0, 1.5, -2)
        }
        else if (sizes.width>450){
            camera.position.set(0,1.5,-2)
        }
        else{
            camera.position.set(0, 1.5, -2)
        }
})


const initializePlacingSet= function(cup, plate){
    singleSetDisplay="on";
    scene.remove(cup,plate);
}


const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null

$(".button").click((e)=>{
    console.log("clock")
    e.preventDefault();
    e.stopPropagation();

    if(teaSetTriggers[1] ==="off"&&teaSetTriggers[2]==="off"&&teaSetTriggers[3]==="off"&&teaSetTriggers[4]==="off"&&teaSetTriggers[5]==="off"&&teaSetTriggers[6]==="off"){

    $(".monitor").removeClass("invisibleP")
    $(".menue").addClass("invisibleP")
    var ButtonName = $(e.target).attr("name")
    switch(ButtonName){
        case "portfolio":
            $(".display").html(portfolio)
            break;
            case "contact":
            $(".display").html(contact)
            break;
            case "about":
            $(".display").html(about)
            break;
            case "news":
            $(".display").html(news)
            break;
            case "random_quotes":
            $(".random_quotes").html(quotes)
            break;
            case "links":
            $(".links").html(links)
            break;
    }
}
})

$(".xButton").click((e)=>{
    e.preventDefault();
    e.stopPropagation();
    $(".monitor").addClass("invisibleP")
    $(".menue").removeClass("invisibleP")
})

$(".play").click((e)=>{  

})
$(".stop").click((e)=>{

})
window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    // console.log(mouse)
})
/**
 * Models
 */
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)


gltfLoader.load(
    '/notexture.glb',
    (gltf) =>
    {
        tableCloth=gltf.scene
        tableCloth.children[0].material = plateMaterial
        tableCloth.children[1].material = plateMaterial
        scene.add(tableCloth)
  
    }
)


gltfLoader.load(
    '/singleset.glb',
    (gltf) =>
    {
        
        singleSet=gltf.scene
        singleCup=singleSet.children[0]
        singlePlate= singleSet.children[1]
        singleGroup=new THREE.Group();
        singleGroup.add(singlePlate,singleCup)

        // console.log(teaset)
        // teaset.scale.set(0.25, 0.25, 0.25)
        // scene.add(teaset)
  
    }
)

gltfLoader.load(
    '/teaset2.glb',
    (gltf) =>
    {
        teaset=gltf.scene
        // console.log(teaset)
        // teaset.scale.set(0.25, 0.25, 0.25)
        scene.add(teaset)
  
    }
)
const cubeTextureLoader = new THREE.CubeTextureLoader()


const RoomMap = cubeTextureLoader.load([
    './px.png',
    './nx.png',
    './py.png',
    './ny.png',
    './pz.png',
    './nz.png'
])

scene.background = RoomMap;
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#7FFFD4', .5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#F5F5DC', 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)
const directionalLight2 = new THREE.DirectionalLight('#5F9EA0', 1)
directionalLight2.castShadow = true
directionalLight2.shadow.mapSize.set(1024, 1024)
directionalLight2.shadow.camera.far = 15
directionalLight2.shadow.camera.left = - 7
directionalLight2.shadow.camera.top = 7
directionalLight2.shadow.camera.right = 7
directionalLight2.shadow.camera.bottom = - 7
directionalLight2.position.set(5, 5, 0)
scene.add(directionalLight2)
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
camera.focus=20
if(sizes.width>860){
camera.position.set(0, 1.5, -2)
}
else if (sizes.width>450){
    camera.position.set(0,1.5,-2)
}
else{
    camera.position.set(0, 1.5, -2)
}
scene.add(camera)
// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.set(4, 2, 0)
controls.enableDamping = true
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

// const effectComposer = new EffectComposer(renderer)
// effectComposer.setSize(sizes.width, sizes.height)
// effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// const renderPass = new RenderPass(scene, camera)
// effectComposer.addPass(renderPass)
renderer.setClearColor( 'orange',.5);
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */

let oldElapsedTime=null;

const clock = new THREE.Clock()
let previousTime = 0
const raycaster = new THREE.Raycaster()

$(window).click(()=>{
    if(intersects.length>0){
        createSingleSet()

    }
  
    
})
var clothToTravel = []
const plateGeometry = new THREE.CylinderGeometry(1,4,.1,4,4,false,4,4)
const plateMaterial = new THREE.MeshBasicMaterial({color:'red'})
const plateMaterial2 = new THREE.MeshBasicMaterial({color:'yellow'})

const plate = new THREE.Mesh(plateGeometry, plateMaterial)
plate.position.y+=2;
scene.add(plate)
// clothToTravel.push(plate)




const tick = () =>
   
{raycaster.setFromCamera(mouse, camera)


    if(tableCloth != null){
        intersects = raycaster.intersectObject(tableCloth.children[0])
        if(intersects.length>0){
            
            // console.log(intersects)
            if(singleGroup!=null&&singleSetDisplay==="on"){
            scene.add(singleGroup)
            singleGroup.position.x=intersects[0].point.x
            singleGroup.position.y=.2
            singleGroup.position.z=intersects[0].point.z
            }
            // console.log(plate.position)
            

        }
        
        }
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    for(const object of objectsToUpdate)
    {
        object.singleFakeCup.position.copy(object.cupbody.position)
        object.singleFakeCup.quaternion.copy(object.cupbody.quaternion)
        object.plateMesh.position.copy(object.platebody.position)
        object.plateMesh.quaternion.copy(object.platebody.quaternion)
        // object.body.applyForce(new CANNON.Vec3(- 10, 0, 0), object.body.position)
    }
    if(objectsToUpdate.length>0){
    // console.log(objectsToUpdate)
    }
    if(mixer)
    {
        mixer.update(deltaTime)
    }
    world.step(1 / 60, deltaTime, 3)

    controls.update()
    renderer.render(scene, camera)
    // effectComposer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()