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