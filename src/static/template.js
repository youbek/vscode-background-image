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