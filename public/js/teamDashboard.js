async function addFavorite() {
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');

    fetch(`/api/addFavoriteTeam/${driverId}`, {
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

document.addEventListener('DOMContentLoaded', function () {
    const NAME = document.getElementById('team-name');
    const NATION = document.getElementById('team-nation');
    const WINS = document.getElementById('team-wins');
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('id');


    function populate(team) {
        console.log(team);
        NAME.textContent = team.constructor[0].name;
        NATION.textContent = team.constructor[0].nationality;
        WINS.textContent = team.wins;
    }

    function fillTable(response) {
        for (const driver of response) {
            const driverDiv = document.createElement('tr');
            driverDiv.innerHTML = `<tr><td>${driver.forename} ${driver.surname}</td> <td> <button onclick="window.location.href='/driverProfile.html?id=${driver.driverId}'" >profile</button> </td> </tr>`;
            document.getElementById('drivers').appendChild(driverDiv);
        }
    }

    if (teamId) {
        fetch(`/api/team/${teamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Team not found');
                }
                return response.json();
            })
            .then(response => {
                populate(response);
                fillGraph(response.winsData);
            })
            .catch(error => {
                NAME.innerHTML = `<p>${error.message}</p>`;
            });

        fetch(`/api/getDriversForTeam/${teamId}`)
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
                NAME.innerHTML = `<p>${error.message}</p>`;
            });
    } else {
        NAME.innerHTML = `<p>No TEAM ID provided.</p>`;
    }
});

