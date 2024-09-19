import * as model from "./model.js";
import * as view from "./view.js";

// TODO: Export functions used by the view

window.addEventListener("load", init);

function init() {
  console.log("Controller init");
  model.init();
  view.init();

  createInitialChain();
  model.loadCannon();
  view.updateDisplay(model);
  // show debug info on the model
  model.dump();
  
  // store "shortcuts" to model and view in window
  window.model = model;
  window.view = view;
}

function createInitialChain() {
  for (let i = 0; i < 5; i++) {
    model.addRandomBall();
  }
}

// TODO: Add controller functions to handle things happening in the view
function addNewBall() {
  const newBallNode = model.addRandomBall();
  console.log("new ball node reference:", newBallNode);
  view.updateDisplay(model);
  view.animateNewBall(model, newBallNode);
  model.dump();
}

function insertCannonballAfter(ballNode) {
  const cannonball = model.getCannonBall();
  const newNode = model.insertBallAfter(cannonball, ballNode);
  model.loadCannon();

  view.updateDisplay(model);
  view.animateCannonBall(model, newNode);
  model.dump();
}

// **** ANIMATIONS ****

// TODO: Add controller functions to be called when animations have completed
function removeMatches(ball) {
  const matches = model.checkMatches(ball);
  model.removeMatches(matches);
  view.updateDisplay(model);
}

export { addNewBall, insertCannonballAfter, removeMatches };
