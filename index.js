//matter.js physics engine stuff
// create an engine
// module aliases
const Engine = Matter.Engine,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

const engine = Engine.create();

//get all divs on the screen
let domElements = [];
getDomElements();

//get screen dimensions
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

//goes through all physics bodies and add click handlers that run when they are clicked on
addClickHandlers();

//add the ground for the physics engine
const ground = Bodies.rectangle(screenWidth/2, screenHeight + 24, screenWidth, 50, { isStatic: true });
const leftWall = Bodies.rectangle(-4, screenHeight / 2, 10, screenHeight, { isStatic: true });
const rightWall = Bodies.rectangle(screenWidth + 4, screenHeight / 2, 10, screenHeight, { isStatic: true });
Composite.add(engine.world, [ground, leftWall, rightWall]);

//constants
let lastRender = 0;
let physicsBodies = [];

//is called each frame, used for physics calculations
//delta is miliseconds since the last frame
function update(delta){
    formUpdate(delta);
    //simulate the physics
    Engine.update(engine, delta);

    //for the js form stuff
    
}

//is alled eac fhrame to draw everything to the screen
function draw(){
    //position all elements based on their physics position
    for(let i = 0; i < physicsBodies.length; i++){
        //add position
        physicsBodies[i].htmlElement.style.left = physicsBodies[i].position.x;
        physicsBodies[i].htmlElement.style.top = physicsBodies[i].position.y;
        //add rotation
        physicsBodies[i].htmlElement.style.transform = `translateX(-50%) translateY(-50%) rotate(${physicsBodies[i].angle}rad)`;
    }
}

//this is the physics.game loop
function gameLoop(timestamp) {
    let delta = timestamp - lastRender;
  
    update(delta);
    draw();
  
    lastRender = timestamp;
    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop); //starts the game loop

//goes through everything on the screen and gets all the physics bodies
//and adds them the the physicsBodiesList
function getDomElements(parentElement = document.body, zIndex=0){
    for(let i = 0; i < parentElement.children.length; i++){
        parentElement.children[i].style.zIndex = zIndex;
        if(!parentElement.children[i].classList.contains("no"))
            domElements.push(parentElement.children[i]);
        getDomElements(parentElement.children[i], zIndex + 1);
    }
}

function addClickHandlers(){
    for(let i = 0; i < domElements.length; i++){
        domElements[i].onclick = (e) => handleDomElementClick(e.target);
    }
}

function handleDomElementClick(target){ 
    //prevents error where child is added, then parent is clicked which will add the child again
    //this makes each DOM element only ably to be given physics once and not duplicate anything
    if(target.style.visibility == "hidden")
        return;

    //get clone
    const clone = target.cloneNode();
    clone.innerText = target.innerText;
    document.body.appendChild(clone); //add clone to screen

    //make object invisible on dom
    target.style.visibility = "hidden";
    target.id = ""; //remove id so js works on physics element

    //TODO make it so you can't interact or click on the invisible object

    const boundingBox = target.getBoundingClientRect();

    //duplicate the object and add it to the dom in the same place with absolute position
    clone.style.position = "absolute";
    clone.style.left = boundingBox.left + (boundingBox.right - boundingBox.left) / 2;
    clone.style.top = boundingBox.top + (boundingBox.bottom - boundingBox.top) / 2;
    clone.classList.add("physics");

    //add clone to physics calculations
    let physicsBody = Bodies.rectangle(
        boundingBox.left + (boundingBox.right - boundingBox.left) / 2,
        boundingBox.top + (boundingBox.bottom - boundingBox.top) / 2,
        boundingBox.right - boundingBox.left,
        boundingBox.bottom - boundingBox.top);
        
    physicsBody.htmlElement = clone;
    physicsBodies.push(physicsBody);

    Composite.add(engine.world, [physicsBody]);

    //TODO: remove the red border, this is just for now
    clone.style.borderColor = "red";
    //perfrom this on all children of the elment
    // for(let i = 0; i < target.children.length; i++){
    //     handleDomElementClick(target.children[i]);
    // }
    refetchElementsById();
    reupdateElements();

    //make it so you can type in a falling input immediately.
    if(target.tagName == "INPUT"){
        clone.focus();
    }
}



//js to make the form stuff work
let timerText = document.getElementById("timer");
let instruction3 = document.getElementById("instruction-3");
let timeElapsed = 0;

function refetchElementsById(){
    timerText = document.getElementById("timer");
    instruction3 = document.getElementById("instruction-3");
}

function reupdateElements(){
    //have this event listener only active once
    //TODO: ^
    instruction3.addEventListener('copy', function(e){
        console.log("copied called");
        let text = window.getSelection().toString();
        console.log(text);
        //'Light switch location: top right'
        e.clipboardData.setData('text/plain', 'Light switch is top right');
        e.preventDefault();
      });
}

function formUpdate(delta){
    timeElapsed += delta / 1000;
    timerText.innerText = timeElapsed.toFixed(1) + " seconds";
}

reupdateElements();
