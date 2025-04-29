import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button') as HTMLButtonElement;
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement;
  const app = document.getElementById('app') as HTMLElement;
  
  function exitMainPage() {
    
}
  
  if (startButton) {
    startButton.addEventListener("click", exitMainPage);
  }
});
