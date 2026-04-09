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
    return data.data[0];
}

const CarbonIntensity = getCarbonIntensity();
const GenerationMix = getGenerationMix();

const xValues = [];
const yValues = [];

GenerationMix.generationmix.array.forEach(element => {
    xValues.push(element.fuel)
    yValues.push(element.perc)
});

console.log(xValues)
console.log(yValues)

barColors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'] 

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

const intensity = CarbonIntensity.intensity.actual / 1000;
const intensity_per_mile = intensity / 4;

console.log(intensity)
console.log(intensity_per_mile)

document.getElementById('intensity').innerHTML = "${intensity}";
document.getElementById('intensity_per_mile').innerHTML = "${intensity_per_mile}";