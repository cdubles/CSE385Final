async function handleSearch() {
    const query = document.getElementById('search-bar').value;
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results
  
    if (query.length < 2) {
      // Avoid making a request for very short input
      return;
    }
  
    try {
      const response = await fetch(`/api/SearchDrivers?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Error fetching search results');
      }
      const results = await response.json();
      results.forEach((result) => {
        console.log(result);

        const resultBox = document.createElement('div');
        resultBox.className = 'search-result';
        
        if(result.type == "Driver"){
          resultBox.textContent = "Driver: " + result.forename + ' ' + result.surname;
        resultBox.onclick = () => {
          window.location.href=`/driverProfile.html?id=${result.id}`;
        }
      };
      if(result.type == "Team"){
          resultBox.textContent = "Team: " + result.team_name;
          resultBox.onclick = () => {
            window.location.href=`/teamProfile.html?id=${result.id}`;
          }

        };
      
    resultsContainer.appendChild(resultBox);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }