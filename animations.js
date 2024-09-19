import * as view from "./view.js";
import * as controller from "./controller.js";

// TODO: Export animation functions
// ALSO: Remember to import the same functions in view
export { animateNewBall, animateCannonBall };

// *********************************
// *                               *
// *         ANIMATIONS            *
// *                               *
// *********************************

function animateNewBall(model, newBall) {
    console.log("Animating new ball", newBall);

    // update entire model
    view.updateDisplay(model);

    // Find the visualBall for this newBall
    const visualBall = view.getVisualBallForModelNode(newBall); // TODO: get the visual Ball from the view

    // We only want to animate the image - not the entire div with the button
    const onlyImg = visualBall.firstElementChild;
    console.log("onlyImg:", onlyImg);

    // First: - position to start from - somewhere just outside the screen
    const startRect = document.querySelector("#chain").getBoundingClientRect().right;
    console.log("startRect", startRect);

    // Last: - position to end - the current position of the visualBall
    const endRect = onlyImg.getBoundingClientRect().left;
    console.log("endRect", endRect);

    // Invert - calculate difference
    // const deltaX = endRect - (startRect - 1500);
    const distance = startRect - endRect;
    console.log("distance", distance);

    // Set the --delta-x property with the calculated deltaX
    onlyImg.style.setProperty("--delta-x", `${distance}px`);

    // Play animation
    onlyImg.classList.add("animate-add");
    onlyImg.addEventListener("animationend", doneAnimateNewBall);

    function doneAnimateNewBall(event) {
        onlyImg.removeEventListener("animationend", doneAnimateNewBall);
        onlyImg.classList.remove("animate-add");
    }
}

/**
 * Use simple animation to expand the space already occupied by a visualball
 */
function animateExpandSpaceForBall(visualBall) {
    visualBall.classList.add("animate-expand");
    visualBall.addEventListener("animationend", doneExpanding);

    function doneExpanding() {
        visualBall.removeEventListener("animationend", doneExpanding);
        visualBall.classList.remove("animate-expand");
    }
}

/**
 * Use FLIP animation to animate a ball from the position of the canonball
 */
function animateCannonBall(model, newBall) {
    // Start by updating the entire model
    view.updateDisplay(model);

    // Find the visualBall for this newBall
    const visualBall = view.getVisualBallForModelNode(newBall); // TODO: get the visual Ball from the view

    // Animate the space for the new ball
    animateExpandSpaceForBall(visualBall);

    // Do FLIP animation to move the newball from the position of the cannonball
    // to the current position of the visualBall

    // First: Find the starting position of the ball - which is where the cannonball is
    const visualCannonball = document.querySelector("#cannon .ball img");
    // TODO: Find the position (x and y) of the visualCannonBall
    const cannonRect = visualCannonball.getBoundingClientRect();

    // Last: Find the destination position of the ball - which is where it has been added
    const ballImage = visualBall.querySelector("img"); // only use the img, not the entire element with the button

    // TODO: Find the position (x and y) of the ballImage
    const ballRect = ballImage.getBoundingClientRect();

    // Invert: calculate the distance to move from source to destination
    const deltaX = cannonRect.left - ballRect.left; // TODO: Replace silly constant with actual distance
    const deltaY = cannonRect.top - ballRect.top; // TODO: Replace silly constant with actual distance

    // Play: run the animation from source to destination
    ballImage.style.setProperty("--delta-x", deltaX + "px");
    ballImage.style.setProperty("--delta-y", deltaY + "px");
    ballImage.classList.add("animate-fromcannon");

    // Hide the cannonball while animating
    document.querySelector("#cannon .ball img").classList.add("hide");

    ballImage.addEventListener("animationend", doneMoving);

    function doneMoving() {
        ballImage.removeEventListener("animationend", doneMoving);
        ballImage.classList.remove("animate-fromcannon");
        ballImage.style.removeProperty("--delta-x");
        ballImage.style.removeProperty("--delta-y");

        // Show the cannonball again, after animating
        document.querySelector("#cannon .ball img").classList.remove("hide");
        // TODO: Notify controller when ball has moved
        console.log("Done moving canonball");
        // controller.removeMatches(newBall)
    }
}

function animateRemoveBalls(model, balls) {
    // NOTE: Run the animation-implode animations BEFORE updating the view

    let first = true;
    const lastBall = balls[balls.length - 1];
    const nextBall = model.getNextBall(lastBall);
    for (const ball of balls) {
        const visualBall = view.getViewForModel(ball);
        visualBall.classList.add("implode");
        if (first) {
            first = false;
            visualBall.addEventListener("animationend", () => {
                view.updateDisplay(model);
                controller.matchesRemoved(nextBall);
            });
        }
    }
}
