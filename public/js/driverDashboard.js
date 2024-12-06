async function addFavorite() {
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');

    fetch(`/api/addFavoriteDriver/${driverId}`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not add driver to favorites');
            }
            return response.json();
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const DOB = document.getElementById('driver-dob');
    const NUMBER = document.getElementById('driver-number');
    const CODE = document.getElementById('driver-reference');
    const TEAM = document.getElementById('driver-team');
    const COUNTRY = document.getElementById('driver-nationality');
    const DRIVER_NAME = document.getElementById('driver-name');
    const WINS = document.getElementById('driver-wins');
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');

    function populate(driver) {
        console.log(driver);
        const name = driver.driver[0].forename + ' ' + driver.driver[0].surname;
        DRIVER_NAME.textContent = name;
        DOB.textContent = driver.driver[0].dob;
        NUMBER.textContent = driver.driver[0].number;
        CODE.textContent = driver.driver[0].code;
        COUNTRY.textContent = driver.driver[0].nationality;
        WINS.textContent = driver.wins;
    }

    function fillTable(response) {
        for (const team of response) {
            const teamDiv = document.createElement('tr');
            teamDiv.innerHTML = `<tr><td>${team.name}</td> <td> <button onclick="window.location.href='/teamProfile.html?id=${team.constructorId}'" >profile</button> </td> </tr>`;
            document.getElementById('teams').appendChild(teamDiv);
        }
    }

    function fillGraph(winsData) {
        const ctx = document.getElementById('winsChart').getContext('2d');

        const winsByYear = winsData.reduce((acc, race) => {
            const year = new Date(race.date).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});

        // Transform into arrays for Chart.js
        const years = Object.keys(winsByYear).map(year => parseInt(year));
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);

        // Generate all years between minYear and maxYear and fill wins with 0 if no wins
        const filledYears = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
        const filledWins = filledYears.map(year => winsByYear[year] || 0);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: filledYears,
                datasets: [{
                    label: 'Wins Over Time',
                    data: filledWins,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Wins'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (driverId) {
        fetch(`/api/driver/${driverId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Driver not found');
                }
                return response.json();
            })
            .then(response => {
                populate(response);
                fillGraph(response.winsData);
            })
            .catch(error => {
                DRIVER_NAME.innerHTML = `<p>${error.message}</p>`;
            });

        fetch(`/api/getTeamsForDriver/${driverId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Team not found');
                }
                return response.json();
            })
            .then(response => {
                console.log(response);
                fillTable(response);
            })
            .catch(error => {
                DRIVER_NAME.innerHTML = `<p>${error.message}</p>`;
            });
    } else {
        DRIVER_NAME.innerHTML = `<p>No driver ID provided.</p>`;
    }
});