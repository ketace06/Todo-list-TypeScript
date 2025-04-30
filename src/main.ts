import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button') as HTMLButtonElement;
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement;
  const app = document.getElementById('app') as HTMLElement;
  
  function exitMainPage() {
    startButton.innerText = "Let's go 🚀";
    startButton.classList.add('start-button-fade');

    setTimeout(() => {
      welcomeScreen.classList.add('fade-out');
    }, 1000);
    setTimeout(() => {
      welcomeScreen.remove()
    }, 2000)
  }
  
  if (startButton) {
    setTimeout(() => {
      startButton.addEventListener("click", exitMainPage);
    }, 1500);
  }
});
