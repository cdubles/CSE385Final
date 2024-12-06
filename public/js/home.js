async function handleSearch() {
    const query = document.getElementById('search-bar').value;
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (query.trim().length === 0) {
        console.log('Query is empty, hiding results.');
        resultsContainer.style.display = 'none'; // Hide container for empty input
        return;
    }

    try {
        console.log(`Searching for: ${query}`);
        const response = await fetch(`/api/SearchDrivers?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Error fetching search results');

        const results = await response.json();
        console.log('Results fetched:', results);

        resultsContainer.style.display = 'block'; // Make sure container is displayed
        if (results.length > 0) {
            results.forEach(result => {
                const resultBox = document.createElement('div');
                resultBox.className = 'search-result';

                if (result.type === "Driver") {
                    resultBox.textContent = `Driver: ${result.forename} ${result.surname}`;
                    resultBox.onclick = () => window.location.href = `/driverProfile.html?id=${result.id}`;
                } else if (result.type === "Team") {
                    resultBox.textContent = `Team: ${result.team_name}`;
                    resultBox.onclick = () => window.location.href = `/teamProfile.html?id=${result.id}`;
                }

                resultsContainer.appendChild(resultBox);
            });
        } else {
            resultsContainer.innerHTML = '<div class="search-result">No results found</div>';
        }
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = '<div class="search-result">Error fetching results. Please try again.</div>';
    }
}

  async function fetchFavoriteTeams() {
    try {
        const response = await fetch('/api/getFavoriteTeams');
        if(response.status==401){window.location.href = `/login.html`;}
        if (!response.ok) throw new Error('Failed to fetch favorite teams');

        const teams = await response.json();
        const container = document.getElementById('favorite-teams');
        container.innerHTML = '<h2>Favorite Teams</h2>';

        teams.forEach(team => {
            const div = document.createElement('div');
            div.className = 'favorite-team';
            div.textContent = `${team.name}`;
            div.onclick = () => {
              window.location.href = `/teamProfile.html?id=${team.constructorId}`;
          };
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching favorite teams:', error);
    }
}

async function fetchFavoriteDrivers() {
  try {
      const response = await fetch('/api/getFavoriteDrivers');
      if (!response.ok) throw new Error('Failed to fetch favorite drivers');

      const drivers = await response.json();
      const container = document.getElementById('favorite-drivers');
      container.innerHTML = '<h2>Favorite Drivers</h2>';

      drivers.forEach(driver => {
          const div = document.createElement('div');
          div.className = 'favorite-driver';
          div.textContent = `${driver.forename} ${driver.surname}`;
          div.onclick = () => {
            window.location.href = `/driverProfile.html?id=${driver.driverId}`;
        };
          container.appendChild(div);
      });
  } catch (error) {
      console.error('Error fetching favorite drivers:', error);
  }
}


  document.addEventListener('DOMContentLoaded', function () {
    fetchFavoriteDrivers();
    fetchFavoriteTeams();
  });

