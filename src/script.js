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
import {createSingleSet, createSingleSetProper} from './createSingleSet.js'
// import createSinglesetProper from './createSingleSet.js'

console.log(createSingleSetProper);


// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
const about = "<p>Shawn Is a person</p>"
const contact = "<div><a href='mailto:shawnyudesign@gmail.com'>shawnyudesign@gmail.com</a></div>"
const portfolio = '<div><ul><li><a href="https://shawnwhy.github.io/Cosmotree/">Cosmo Tree</a></li> <li><a href="https://shawnwhy.github.io/CloudySky/">Sky Over Berlin</a></li><li><a href="https://shawnwhy.github.io/CandieEater/">Diary of a Candy Eater</a></div>'
const news = "<p>Under Construction</p>"
const links = "<p>links</p><ul><li>link</li><li>link</li><li>link</li></ul>"
const textureLoader = new THREE.TextureLoader()
const floorTexture = textureLoader.load('/checker1.jpg')
floorTexture.repeat.set(6,6)
floorTexture.wrapT = THREE.MirroredRepeatWrapping
floorTexture.wrapS = THREE.MirroredRepeatWrapping

const floorMaterial = new THREE.MeshBasicMaterial({map:floorTexture})
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
let play = "off"

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
}



let currentTrigger = null 

let singleSetDisplay = "off"

let createSinglesetProperTrigger = "off"

const quotes = [
    "Words bounce. Words, if you let them, will do what they want to do and what they have to do.- Anne Carson",
"To be running breathlessly, but not yet arrived, is itself delightful, a suspended moment of living hope. - Anne Carson",
"As Sokrates tells it, your story begins the moment Eros enters you. That incursion is the biggest risk of your life. How you handle it is an index of the quality, wisdom, and decorum of the things inside you. As you handle it you come into contact with what is inside you, in a sudden and startling way. You perceive what you are, what you lack, what you could be.-Anne Carson",
"For centuries poets, some poets, have tried to give a voice to the animals, and readers, some readers, have felt empathy and sorrow. If animals did have voices, and they could speak with the tongues of angels--at the very least with the tongues of angels--they would be unable to save themselves from us. What good would language do? Their mysterious otherness has not saved them, nor have their beautiful songs and coats and skins and shells and eyes. We discover the remarkable intelligence of the whale, the wolf, the elephant--it does not save them, nor does our awareness of the complexity of their lives. Their strength, their skills, their swiftness, the beauty of their flights. It matters not, it seems, whether they are large or small, proud or shy, docile or fierce, wild or domesticated, whether they nurse their young or brood patiently on eggs. If they eat meat, we decry their viciousness; if they eat grasses and seeds, we dismiss them as weak. There is not one of them, not even the songbird who cannot, who does not, conflict with man and his perceived needs and desires. St. Francis converted the wolf of Gubbio to reason, but he performed this miracle only once and as miracles go, it didn’t seem to capture the public’s fancy. Humans don’t want animals to reason with them. It would be a disturbing, unnerving, diminishing experience; it would bring about all manner of awkwardness and guilt.― Joy Williams",
"Wouldn't it be wonderful if I won a helicopter in a crossword puzzle competition? There is not much hope though I am afraid, as they never give such practical prizes.-Leonora Carrington"  

]


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
         friction: .6,
         restitution: 0.01
     }
 )
 world.addContactMaterial(defaultContactMaterial)

 const cupbow = new CANNON.Cylinder(.155,.1,.13,8)
const plateDrop = new CANNON.Cylinder(.3,.15,.05,8)
const cupHandle = new CANNON.Cylinder(.1,.1,.01,8)
const cupbody = new CANNON.Body({mass:.2})
const platebody = new CANNON.Body({mass:.2})
cupbody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0),Math.PI *0.5)
cupbody.material=defaultMaterial;
cupbody.addShape(cupbow,new CANNON.Vec3(0,0,0))
cupbody.addShape(cupHandle,new CANNON.Vec3(.115,0,0))
cupbody.addShape(plateDrop,new CANNON.Vec3(0,0,0))
world.addBody(cupbody)


 //physics floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.position=new CANNON.Vec3(0, -1.9, 0)
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
 floorMaterial
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


const initializePlacingProper= function(cup, plate){
    singleSetDisplay="on";
    createSinglesetProperTrigger="on"
    cup.visible=false
plate.visible=false}
const placeSingleSetProper = function(number){

teaSetTriggers[number]="off"
singleSetDisplay="off";
singleGroup.visible=false;
$(".monitor").removeClass("invisibleP")
$(".menue").addClass("invisibleP")

// createSinglesetProper()


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
    let random = Math.floor(Math.random()*quotes.length-1)
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
            random = Math.floor(Math.random()*3)
            $(".display").html(quotes[random])
            break;
            case "links":
            $(".display").html(links)
            break;
    }

  
}
else{

    
    currentTrigger = $(e.target).attr("name")
   
    var ButtonName = $(e.target).attr("name")
    let random = Math.floor(Math.random()*quotes.length-1)
    switch(ButtonName){
        case "portfolio":
            if(teaSetTriggers[1]=="off"){
                $(".display").html(portfolio)
                $(".monitor").removeClass("invisibleP")
                $(".menue").addClass("invisibleP")
                }
            else{
            initializePlacingProper(plates[1],cups[1])
            currentTrigger=1
            $(".display").html(portfolio)
            }
            break;
            case "contact":
            if(teaSetTriggers[2]=="off"){
                $(".display").html(contact)
                $(".monitor").removeClass("invisibleP")
                $(".menue").addClass("invisibleP")
                }
            else{
            initializePlacingProper(plates[2],cups[2])
            currentTrigger=2
            $(".display").html(contact)
            }
            break;
            case "about":
            if(teaSetTriggers[3]=="off"){
                $(".display").html(about)
                $(".monitor").removeClass("invisibleP")
                $(".menue").addClass("invisibleP")
                }
            else{
            initializePlacingProper(plates[3],cups[3])
            currentTrigger=3
            $(".display").html(about)
            }
            break;
            case "news":
            if(teaSetTriggers[4]=="off"){
                $(".display").html(news)
                $(".monitor").removeClass("invisibleP")
                $(".menue").addClass("invisibleP")
                }
            else{
            initializePlacingProper(plates[4],cups[4])
            currentTrigger=4
            $(".display").html(news)
            }
            break;
            case "random_quotes":
            if(teaSetTriggers[5]=="off"){
                $(".display").html(quotes[random])
                $(".monitor").removeClass("invisibleP")
                $(".menue").addClass("invisibleP")
                }
            else{
            initializePlacingProper(plates[5],cups[5])
            currentTrigger=5
            $(".display").html(quotes[random])
            }
            break;
            case "links":
            if(teaSetTriggers[6]=="off"){
                 $(".display").html(links)
                 $(".monitor").removeClass("invisibleP")
                 $(".menue").addClass("invisibleP")
                 }
                else{
            initializePlacingProper(plates[6],cups[6])
            currentTrigger=6
            $(".display").html(links)
                }
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
    $(".stop").removeClass("invisibleP")
    $(".play").addClass("invisibleP")
    e.preventDefault();
    e.stopPropagation();
    createSinglesetProperTrigger="off"
    play = "on"
    singleSetDisplay="on"
    teaset.visible=false
    $(".button").addClass("invisibleP")


})
$(".stop").click((e)=>{
    $(".play").removeClass("invisibleP")
    $(".stop").addClass("invisibleP")
    e.preventDefault();
    e.stopPropagation();
    $(".button").removeClass("invisibleP")
    play = "off"
    singleSetDisplay = "off"
    teaset.visible=true
    singleGroup.visible=false
    
    objectsToUpdate.forEach(element => {
        scene.remove(element.plateMesh, element.singleFakeCup);
        world.remove(element.platebody,element.cupbody)
        
        
    });



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
    '/tableandcloth.glb',
    (gltf) =>
    {
        tableCloth=gltf.scene
        // tableCloth.children[0].material = plateMaterial
        // tableCloth.children[1].material = plateMaterial
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
        singleCup.position.y+=.07;
        singleGroup=new THREE.Group();
        singleGroup.add(singlePlate,singleCup)
        singleGroup.visible=false
        scene.add(singleGroup)

       
  
    }
)

gltfLoader.load(
    '/teaset2.glb',
    (gltf) =>
    {
        teaset=gltf.scene
        console.log(teaset)
        // teaset.scale.set(0.25, 0.25, 0.25)
        cups[1]=teaset.children[4]
        cups[2]=teaset.children[2]
        cups[3]=teaset.children[3]
        cups[4]=teaset.children[7]
        cups[5]=teaset.children[5]
        cups[6]=teaset.children[6]
        plates[1]=teaset.children[13]
        plates[2]=teaset.children[12]
        plates[3]=teaset.children[10]
        plates[4]=teaset.children[9]
        plates[5]=teaset.children[8]
        plates[6]=teaset.children[14] 
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
        if(play==="on"){
        createSingleSet(CANNON, THREE, intersects,defaultMaterial, singleGroup,scene, world, objectsToUpdate)
        }
        else if(createSinglesetProperTrigger==="on"){
        createSingleSetProper(CANNON, THREE, intersects,defaultMaterial, singleGroup,scene, world, objectsToUpdate)
        createSinglesetProperTrigger="off"
        singleSetDisplay="off"
        singleGroup.visible=false
        $(".menue").addClass("invisibleP")
        $(".monitor").removeClass("invisibleP")
        teaSetTriggers[currentTrigger]="off"
        
        }

    }
  
    
})
var clothToTravel = []
const tableGeo = new CANNON.Box(new CANNON.Vec3(1.75,.05,.9))
const tablebody = new CANNON.Body({mass:0})
tablebody.addShape(tableGeo,new CANNON.Vec3(0,.03,0));
tablebody.material=defaultMaterial;
// tablebody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0),Math.PI *0.5)

// const tableGeometry = new THREE.BoxGeometry(3.5,.1,1.8)
const plateMaterial = new THREE.MeshBasicMaterial({color:'red'})
const plateMaterial2 = new THREE.MeshBasicMaterial({color:'yellow'})
// const tableMesh = new THREE.Mesh(tableGeometry, plateMaterial2)
// tableMesh.position.y+=.05

world.add(tablebody)
// tableMesh.rotation.x =  Math.PI * 0.5
// const tableGroup = new THREE.Group()
// tableGroup.add(tableMesh)
// scene.add(tableGroup)
// tableGroup.position.copy(tablebody.position)
// tableGroup.quaternion.copy(tablebody.quaternion)
// clothToTravel.push(plate)




const tick = () =>
   
{raycaster.setFromCamera(mouse, camera)


    if(tableCloth != null){
        intersects = raycaster.intersectObject(tableCloth.children[0])
        if(intersects.length>0){
            
            // console.log(intersects)
            if(singleGroup!=null&&singleSetDisplay==="on"){
            singleGroup.visible=true;
            singleGroup.position.x=intersects[0].point.x
            singleGroup.position.y=.2
            singleGroup.position.z=intersects[0].point.z
            if(play=="on"){
            cupbody.position.copy(singleGroup.position)
            cupbody.quaternion.copy(singleGroup.quaternion)
            }
            else{
                cupbody.position.z = 5
            }
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
    // tableGroup.position.copy(tablebody.position)
    // tableGroup.quaternion.copy(tablebody.quaternion)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()