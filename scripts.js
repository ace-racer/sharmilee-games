const imagesDirectory = 'images';
const numberOfImages = 4; // You can change this value as needed
const totalImagesAvailable = 20; // Total number of images available in the directory
const markerAngle = 90; // marker is at the top

window.onload = function() {
    const wheel = document.getElementById('wheel');

    // Generate an array of indices and shuffle
    let indices = Array.from({length: totalImagesAvailable}, (v, k) => k + 1);
    indices = shuffleArray(indices).slice(0, numberOfImages);
    console.log("indices chosen: " + indices);

    // Populate the wheel with images
    indices.forEach((index, i) => {
        //console.log("image: image" + index);
        //console.log("transform angle: " + i * (360 / numberOfImages));
        const segment = document.createElement('img');
        segment.src = `${imagesDirectory}/image${index}.jpg`;
        segment.className = 'segment';
        segment.style.transform = `rotate(${i * (360 / numberOfImages)}deg)`;
        segment.alt = `Design ${index}`;
        wheel.appendChild(segment);
    });
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.getElementById('spin-button').addEventListener('click', function() {
    const button = this; // Reference to the button
    const wheel = document.getElementById('wheel');
    const resultContainer = document.getElementById('result-container');
    const resultMessage = document.getElementById('result-message');
    const chosenDesign = document.getElementById('chosen-design');

    resultMessage.textContent = '';
    chosenDesign.src = '';
    chosenDesign.alt = '';

    // Hide the result container initially
    resultContainer.style.display = 'none';

    // Disable the button to prevent further clicks
    button.disabled = true;

    // Generate a random number for the rotation angle (0 to 360 degrees)
    const randomRotation = Math.floor(Math.random() * 360) + 1800; // Ensures at least 5 full spins
    wheel.style.transform = `rotate(${randomRotation}deg)`;

    setTimeout(() => {
        const selectedAngle = randomRotation % 360;
        const segmentAngle = 360 / numberOfImages;
        const originalStartingCentroidAngle = segmentAngle / 2;
        let chosenSegment = -1;
        let nearestAngleToMarker = 1000000;
        for (let i = 0; i < numberOfImages; i++){
            let currentCentroidAngle = (selectedAngle + originalStartingCentroidAngle + (i * segmentAngle)) % 360;
            let currentAngleDifference = Math.abs(currentCentroidAngle - markerAngle);
            console.log(`The segment ${i} has currentCentroidAngle ${currentCentroidAngle} and angle difference ${currentAngleDifference} from marker at ${markerAngle}`);
            if (currentAngleDifference < nearestAngleToMarker) {
                console.log(`Updating the segment ${i} as nearest as it has lower angle difference than ${nearestAngleToMarker}`);
                nearestAngleToMarker = currentAngleDifference;
                chosenSegment = i;
            }
        }
        // let chosenSegment = Math.floor((selectedAngle + (segmentAngle / 2)) % 360 / segmentAngle);
        console.log(`selectedAngle: ${selectedAngle} segmentAngle: ${segmentAngle} chosenSegment:${chosenSegment}`)
        // Correct for potential wrap-around
        // chosenSegment = (numberOfImages - chosenSegment) % numberOfImages;
        // console.log(`After correction chosenSegment:${chosenSegment}`)

        const chosenImage = document.querySelectorAll('.segment')[chosenSegment];
        resultMessage.textContent = `You chose: ${chosenImage.alt}`;
        console.log(`You chose: ${chosenImage.alt}`)
        chosenDesign.src = chosenImage.src;
        chosenDesign.alt = chosenImage.alt;

        // Show the result container now that a design is chosen
        resultContainer.style.display = 'block';
    }, 4000); // Wait for the transition to finish
});