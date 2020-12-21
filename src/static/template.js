const images = [];

(function () {
  const bodyNode = document.querySelector("body");
 
  function initialize(obs) {
    const themeStyleTag = document.querySelector(".vscode-tokens-styles");

    if(!themeStyleTag) {
      return;
    }
  
    const initialThemeStyles = themeStyleTag.innerText;
    const updatedThemeStyles = `${initialThemeStyles}[BACKGROUND_STYLES]`;
  
    const newStyleTag = document.createElement("style");
    newStyleTag.setAttribute("id", "background-image");
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');
    document.body.appendChild(newStyleTag);
  
    console.log(`Background Image initialised!`);
  
    if(obs) {
      obs.disconnect();
    }
  }

  // Callback function to execute when mutations are observed
  function watchForInitialize(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          const tokensLoaded = document.querySelector('.vscode-tokens-styles');

          // sometimes VS code takes a while to init the styles content, so stop this observer and add an observer for that
          if (tokensLoaded) {
            observer.disconnect();
            observer.observe(tokensLoaded, { childList: true });
          }
        }

        if (mutation.type === 'childList') {
          const tokensLoaded = document.querySelector('.vscode-tokens-styles');
          const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText;

          // Everything we need is ready, so initialise
          if (tokensLoaded && tokenStyles) {
            initialize(observer);
          }
        }
    }
  };

  initialize();

  const observer = new MutationObserver(watchForInitialize);
  observer.observe(bodyNode, { attributes: true });
})();

function ShortCut(keys) {
  this._cb = () => {};
  this._keysSequence = [];
  this._keys = keys;

  document.addEventListener("keydown", event => {
    // IF PRESSED KEY IS THE RIGHT KEY (IN SEQUENCE)
    if(event.key === this._keys[this._keysSequence.length]) {
      this._keysSequence.push(this._keys[this._keysSequence.length]);
    }
    // IF NEXT PRESSED KEY WAS WRONG KEY AND THERE WAS ALREADY A SEQUENCE THEN RESET _keysSequence
    else if(this._keysSequence.length > 0) {
      this._keysSequence = [];
    }
  });

  document.addEventListener("keyup", event => {
    // IF PRESSED KEY IN THE SEQUENCE IS RELEASED
    if(this._keysSequence.includes(event.key)) {
      // IF ALL KEYS ARE PRESSED IN SEQUENCE THEN RUN CB
      if(this._keysSequence.length === this._keys.length) {
        this._cb();
        this._keysSequence = [];
      }
      // IF NOT ALL KEYS ALL PRESSED YET, THEN RESET THE SEQUENCE
      else {
        this._keysSequence = [];
      }
    }
  });

  this.on = function (cb) {
    this._cb = cb;
  };
}

const imageShortCut = new ShortCut(["Control", "Alt", "n"]);

imageShortCut.on(() => {
  console.log("YOU PRESSED THE SHORTCUT LET'S UPDATE THE BACKGROUND!");
});