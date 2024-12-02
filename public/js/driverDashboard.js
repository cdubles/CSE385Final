
document.addEventListener('DOMContentLoaded', function() {
    const DOB = document.getElementById('driver-dob');
    const NUMBER = document.getElementById('driver-number');
    const CODE = document.getElementById('driver-reference');
    const TEAM = document.getElementById('driver-team');
    const COUNTRY = document.getElementById('driver-nationality');
    const DRIVER_NAME = document.getElementById('driver-name');
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');

    function populate(driver) {
        console.log(driver);
        const name = driver.forename + ' ' + driver.surname;
        DRIVER_NAME.textContent = name;
        DOB.textContent = driver.dob;
        NUMBER.textContent = driver.number;
        CODE.textContent = driver.code;
        COUNTRY.textContent = driver.nationality;
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
        } else {
            DRIVER_NAME.innerHTML = `<p>No driver ID provided.</p>`;
        }
});