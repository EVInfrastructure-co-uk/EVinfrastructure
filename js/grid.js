// Fetch current carbon intensity
async function getCarbonIntensity() {
    const response = await fetch("https://api.carbonintensity.org.uk/intensity");
    const data = await response.json();
    return data.data[0];
}

// Fetch current generation mix
async function getGenerationMix() {
    const response = await fetch("https://api.carbonintensity.org.uk/generation");
    const data = await response.json();
    return data.data;
}

// Wrap everything in an async function to use await
async function initializeChart() {
    const CarbonIntensity = await getCarbonIntensity();
    const GenerationMix = await getGenerationMix();

    const xValues = [];
    const yValues = [];

    GenerationMix.generationmix.forEach(element => {
        xValues.push(element.fuel);
        yValues.push(element.perc);
    });

    console.log(xValues);
    console.log(yValues);

    const barColors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];

    const ctx = document.getElementById('gridintensity');

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "GB grid live generation mix"
            }
        }
    });

    const intensity_g = CarbonIntensity.intensity.actual;

    console.log(intensity_g);

    const intensity_kg = intensity_g / 1000;
    const intensity_per_mile = intensity_kg / 4;

    console.log(intensity_kg);
    console.log(intensity_per_mile);

    document.getElementById('intensity').innerHTML = `${intensity_kg.toFixed(3)}`;
    document.getElementById('intensity_per_mile').innerHTML = `${intensity_per_mile.toFixed(3)}`;
    document.getElementById('factor').innerHTML = `${(0.23/intensity_per_mile).toFixed()}`
}

// Call the function when page loads
initializeChart().catch(error => console.error('Error loading grid data:', error));