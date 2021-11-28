// ES version: 6

// Runs game once DOM is fully loaded
jQuery(document).ready(function ($) {
  // unchanging variables
  const holes = $(".hole");
  const moles = $(".mole");
  const timer = $(".timer");
  const currentScore = $(".current-score");
  const startButton = $(".start-button");
  const MoleAudio = new Audio("assets/sounds/Mole.mp3");
  const backgroundAudio = new Audio("assets/sounds/background-music.mp3");
  // Dynamically changing variables
  let sameHole;
  let timeUp = false;
  let startTime = 30000;
  let score = 0;
  let countdown;

  // Chooses which hole the mole will appear from
  function findHole(holes) {
    const randomHole = Math.floor(Math.random() * holes.length); // Picks a random hole between 0 - 8
    const hole = holes[randomHole]; // assigns chosen hole
    if (hole === sameHole) {
      return findHole(holes); // If the same hole is selected twice in a row the function will run again
    }
    sameHole = hole; // Assigns selected hole to check in the if statement
    return hole;
  }

  // Hard difficulty
  function comeUpFastest() {
    backgroundAudio.playbackRate = 1.4; // Increases speed of music
    $(".mole").css(
      // Changes image when this function runs
      "background-image",
      "url(assets/images/mole-very-angry.png)"
    );
    // Chooses random time between 400ms and 1s
    const fastestTime = Math.random() * 1000 + 400;
    const holeUp = findHole(holes); // Selects hole chosen by findHole()
    holeUp.classList.add("up"); // Adds CSS to the selected hole to make the mole appear

    // Function makes moles do down if they haven't been hit
    setTimeout(() => {
      holeUp.classList.remove("up");
      if (!timeUp) comeUpFastest(); // If timeUp is false run comeUpFastest() again
    }, fastestTime); // Amount of time we wait before moles go down
  }
  // Medium difficulty
  function comeUpFaster() {
    backgroundAudio.playbackRate = 1.2; // Increases speed of music
    $(".mole").css("background-image", "url(assets/images/mole-angry.png)"); // changes image when this function runs
    // Chooses random time between 400ms and 1.4s
    const fasterTime = Math.random() * 1400 + 400;
    const holeUp = findHole(holes); // Selects hole chosen by findHole()
    holeUp.classList.add("up"); // Adds CSS to the selected hole to make the mole appear
    // Function makes moles do down if they haven't been hit
    setTimeout(() => {
      holeUp.classList.remove("up");
      if (!timeUp) selectSpeed(); // If timeUp is false run selectSpeed() again
    }, fasterTime); // Amount of time we wait before moles go down
  }
  // Easy difficulty
  function comeUp() {
    backgroundAudio.playbackRate = 1; // Plays audio at normal rate when playing again
    $(".mole").css("background-image", "url(assets/images/mole.png)");
    const time = Math.random() * 2000 + 500; // Chooses random time between 500ms and 2s
    const holeUp = findHole(holes); // Selects hole chosen by findHole()
    holeUp.classList.add("up"); // Adds CSS to the selected hole to make the mole appear

    // Function makes moles do down if they haven't been hit
    setTimeout(() => {
      holeUp.classList.remove("up");
      if (!timeUp) selectSpeed(); // If timeUp is false run selectSpeed() again
    }, time); // Amount of time we wait before moles go down
  }
  // Function that changes difficulty
  function selectSpeed() {
    setTimeout(() => {
      if (score >= 8) {
        comeUpFastest();
      } else if (score >= 4) {
        comeUpFaster();
      } else {
        comeUp();
      }
    }, 100);
  }

  // Function to run the game when the start button is clicked
  function startGame() {
    countdown = startTime / 1000; // Assigns 30s to countdown
    $(timer).html(countdown); // Puts the time in the HTML
    score = 0;
    $(currentScore).html(`${score}`); // Adds the starting score to HTML
    timeUp = false;
    selectSpeed();

    // Function to check if timer has reached 0
    function checkTime() {
      if (countdown < 1) {
        timeUp = true;
        backgroundAudio.pause(); // Will pause Background audio when game ends
      } else {
        backgroundAudio.play(); // play Background audio while the game is running in a loop
        backgroundAudio.loop = true;
        setTimeout(checkTime, 1000); // if not check again every 1s
      }
    }
    checkTime(); // calls function so it runs

    let startTimer = setInterval(() => {
      // decrement the timer
      countdown -= 1;
      $(timer).text(`Time Left:${countdown}`); // Adds countdown to html
      $(currentScore).text(score);
      if (countdown < 1) {
        countdown = 0;
        clearInterval(startTimer); // Clears the setInterval() after timer reaches 0
        $(timer).html(`Time Left:${countdown}`);
        endGameCard();
      }
    }, 1000);
    // Function to display .end-game-card
    function endGameCard() {
      $(".end-game-card").addClass("end-game-show");
    }
  }

  // Increment score when mole is clicked
  function MoleGame(e) {
    MoleAudio.play();
    score++; // Increments score by 1 when mole is clicked

    if (score % 10 === 0) {
      // Adds an extra 10s after the score reaches multiples of 10
      countdown += 10;
    }
    $(this).css("background-image", "url(assets/images/mole-hit.png)"); // Changes image to indicate mole was hit
    $(this).css("pointer-events", "none"); // Prevents clicking the same mole twice to score extra points
    setTimeout(() => {
      $(this).css("background-image", "url(assets/images/mole.png)");
    }, 800); // Changes image back to mole after 800ms
    setTimeout(() => {
      $(this).css("pointer-events", "auto"); // Resets pointer events after 600ms
    }, 600);
    $(currentScore).text(score); // Appends the score to the .current-score div
  }

  // Event listeners
  // Runs MoleGame function when mole image is clicked
  $(moles).on("click", MoleGame);

  // Starts game after start button is pressed
  $(startButton).click(() => {
    $(".game-card-show").addClass("game-card-hide");
    startGame();
  });

  // Starts game after play again button is pressed
  $(".play-again").click(() => {
    $(".end-game-card").removeClass("end-game-show");
    startGame();
  });

  // Mute button eventListener
  $(".mute-button").click(() => {
   let volumeOn = "fas fa-volume-up";
   let volumeOff = "fas fa-volume-mute";
    // if statement that changes icon used for mute button when clicked
    if (backgroundAudio.muted) {
      $("#remove-icon").removeClass(volumeOn);
      $("#remove-icon").addClass(volumeOff);
    } else {
      $("#remove-icon").addClass(volumeOn);
    }
    backgroundAudio.muted = !backgroundAudio.muted; // Toggles between true and false for .mute
  });
}); // End of DOM ready function
