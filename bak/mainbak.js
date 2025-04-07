document.addEventListener('DOMContentLoaded', function() {
    // Get the start button
    const startButton = document.getElementById('startButton');
    
    // Initialize game when the start button is clicked
    startButton.addEventListener('click', UI.showGameOptions);
});