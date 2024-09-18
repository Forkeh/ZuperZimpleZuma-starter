import * as model from "./model.js";
import * as view from "./view.js";

// TODO: Export functions used by the view

window.addEventListener("load", init);

function init() {
    console.log("Controller init");
    model.loadCannon();
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
    model.addRandomBall();
    view.updateDisplay(model);
}

function insertCannonBallAfter(ballModel) {
    const cannonball = model.getCannonBall();
    console.log("cannonball:", cannonball);

    model.insertBallAfter(cannonball, ballModel);
    model.loadCannon();
    view.updateDisplay(model);
    model.dump();
}

// **** ANIMATIONS ****

// TODO: Add controller functions to be called when animations have completed

export { addNewBall, insertCannonBallAfter as insertCannonBallAfter };
