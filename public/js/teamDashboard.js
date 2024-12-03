document.addEventListener('DOMContentLoaded', function() {
    const NAME = document.getElementById('team-name');
    const NATION = document.getElementById('team-nation');
    const WINS = document.getElementById('team-wins');
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');

    function populate(team) {
        console.log(team);
        NAME.textContent = team.constructor[0].name;
        NATION.textContent = team.constructor[0].nationality;
        WINS.textContent = team.wins;
        }

        if (driverId) {
            fetch(`/api/team/${driverId}`)
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
        } else {
            NAME.innerHTML = `<p>No TEAM ID provided.</p>`;
        }
});