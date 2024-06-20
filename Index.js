const place = document.getElementById('place');
const region = document.getElementById('region');
const country = document.getElementById('country');
const searchbox = document.getElementById('searcharea');
const searchbutton = document.getElementById('submit');
const conditionimg = document.getElementById('conditionimg');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const condition = document.getElementById('condition');
const windspeed = document.getElementById('windspeed');
const error = document.getElementById('error');
const filterinput = document.getElementById('filterdata');
const filterbutton = document.getElementById('filter');
const result = document.getElementById('result');
const reloadbtn=document.getElementById(`reloadbtn`);

reloadbtn.addEventListener('click',()=>{
    location.reload();
})


searchbutton.addEventListener('click', () => {
    let query = searchbox.value;
    error.style.display = 'none';

    let apikey = 'fd496861b08c4da4a41124948242301';
    let url = `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${query}&aqi=no`;
    let url1 = `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${query}&days=8&aqi=no&alerts=no`;

    if (!query) {
        error.style.display = 'block';
    } else {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                let weatherreport = data.current;
                console.log(data);
                place.innerHTML = query;
                region.innerHTML=`${data.location.region}`;
                country.innerHTML=`${data.location.country}`;
                conditionimg.src = `http:${weatherreport.condition.icon}`;
                temperature.innerHTML = `${weatherreport.temp_c} °C`;
                humidity.innerHTML = `${weatherreport.humidity} %`;
                condition.innerHTML = `${weatherreport.condition.text}`;
                windspeed.innerHTML = `${weatherreport.wind_kph} Km/h`;
            })
            .catch(err => {
                error.style.display = 'block';
                error.innerHTML = `Error: ${err.message}`;
            });
    }

    let tempdata = [];
    let tempc = [];
    let tempf = [];
    let wind = [];
    let humi = [];

    fetch(url1)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let report = data.forecast;
            console.log(report);

            for (let i = 0; i <= 2; i++) {
                tempdata.push(report.forecastday[i].date);
                tempc.push(report.forecastday[i].day.maxtemp_c);
                tempf.push(report.forecastday[i].day.maxtemp_f);
                wind.push(report.forecastday[i].day.maxwind_kph);
                humi.push(report.forecastday[i].day.avghumidity);
            }

                                                    // Destroy existing Charts if they exist
                               
            if (Chart.getChart("barchart1")) {
                Chart.getChart("barchart1").destroy();
            }

            if (Chart.getChart("barchart2")) {
                Chart.getChart("barchart2").destroy();
            }

            if (Chart.getChart("linechart")) {
                Chart.getChart("linechart").destroy();
            }

            if (Chart.getChart("piechart")) {
                Chart.getChart("piechart").destroy();
            }

            // Create new Charts
            const bar1 = document.getElementById('barchart1');
            new Chart(bar1, {
                type: 'bar',
                data: {
                    labels: tempdata,
                    datasets: [{
                        label: '# temperatureC',
                        data: tempc,
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            const bar2 = document.getElementById('barchart2');
            new Chart(bar2, {
                type: 'bar',
                data: {
                    labels: tempdata,
                    datasets: [{
                        label: '# temperatureF',
                        data: tempf,
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            const line = document.getElementById('linechart');
            new Chart(line, {
                type: 'line',
                data: {
                    labels: tempdata,
                    datasets: [{
                        label: '# maxwind',
                        data: wind,
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            const pie = document.getElementById('piechart');
            new Chart(pie, {
                type: 'pie',
                data: {
                    labels: tempdata,
                    datasets: [{
                        label: '# average humidity',
                        data: humi,
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            filterbutton.addEventListener("click", () => {
                let datatemp = [];
                let filterdata = [];

                for (let i = 1; i <= 2; i++) {
                    datatemp.push({
                        tdate: report.forecastday[i].date,
                        ttemp: report.forecastday[i].day.maxtemp_c,
                    });
                }

                filterdata = datatemp.filter(data => data.ttemp > filterinput.value);

                                                 // Convert filter data into string

                let resultString = "";
                filterdata.forEach(data => {
                    resultString += `<p>Date: ${data.tdate}, Temperature: ${data.ttemp}°C</p>`;
                });

            
                if(resultString.length==0 ){
                    result.innerHTML=`NO data!`;
                }
                else if(filterinput.value.length==0){
                    result.innerHTML='input is empty!'
                }
                else{
                result.innerHTML = resultString;
                }
            });

        })
        .catch(err => {
            error.style.display = 'block';
            error.innerHTML = `Error: ${err.message}`;
        });
        

});
