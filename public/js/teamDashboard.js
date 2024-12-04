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
                fillTable(response)
            })
            .catch(error => {
                NAME.innerHTML = `<p>${error.message}</p>`;
            });
    } else {
        NAME.innerHTML = `<p>No TEAM ID provided.</p>`;
    }
});