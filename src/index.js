import "babel-polyfill";
import Chart from "chart.js";

const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

var daysArray = new Array();

async function loadCurrency() {
  const response = await fetch(meteoURL); 
  const xmlTest = await response.text(); 
  const parser = new DOMParser();
  const currencyData = parser.parseFromString(xmlTest, "text/xml"); 
  const days = currencyData.querySelectorAll("FORECAST[day][hour]");
  const temperatures = currencyData.querySelectorAll("TEMPERATURE[max][min]");
  const heat = currencyData.querySelectorAll("HEAT[max]")
  for (let i = 0; i < days.length; i++) {
    const dayTag = days.item(i);
    const tempTag = temperatures.item(i);
    const heatTemp = heat.item(i);
    daysArray[i] = {
      day: dayTag.getAttribute("day"),
      hour: dayTag.getAttribute("hour"),
      realTemper: tempTag.getAttribute("max"),
      heatTemper: heatTemp.getAttribute("max"),
    }
    
  }

}

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");
buttonBuild.addEventListener("click", async function() {
  const currencyData = await loadCurrency();

  var labelsData = []; //время
  for(let i = 0; i < daysArray.length; i++) {
    labelsData[i] = daysArray[i]["hour"] + ':00';
  }
  
  var realTempArr = []; //температура
  for(let j = 0; j < daysArray.length; j++) {
    realTempArr[j] = daysArray[j]["realTemper"];
  }

  var heatTempArr = []; //температура по ощущениям
  for(let k = 0; k < daysArray.length; k++) {
    heatTempArr[k] = daysArray[k]["heatTemper"];
  }

    
  var realTempData = {
    label: "Температура",
    data: realTempArr,
    backgroundColor: 'rgba(245, 95, 95, 0.8)',
    borderColor: 'rgba(66, 64, 64, 0.5);',
    pointHoverBorderWidth: 10
  };
  
  var heatTempData = {
    label: "Температура по ощущениям",
    data: heatTempArr,
    backgroundColor: 'rgba(120, 250, 95, 0.8)',
    borderColor: 'rgba(66, 64, 64, 0.5);',
  };



  var TempData = {
    labels: labelsData,
    datasets: [realTempData, heatTempData],
  };

  var optionsTitle = {
    title: {
      display: true,
      text: 'Температура, °C',
      position: 'left'
    }
  } 
   
  var lineChart = new Chart(canvasCtx, {
    type: 'line',
    data: TempData,
    options: optionsTitle
  });

});