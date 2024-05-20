// Function to display results
function displayResults(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear previous results
  
    if (data.results && data.results.length > 0) {
      data.results.forEach((result) => {
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
          <h5>${result.hospitalName || result.city || result.pincode}</h5>
          <p>${result.description || ""}</p>
        `;
        container.appendChild(resultItem);
      });
    } else {
      container.innerHTML = "<p>No results found.</p>";
    }
  }
  
  // Function to handle searching by hospital name
  function searchByHospital() {
    const hospitalName = document.getElementById("search-hospital").value;
  
    fetch("/search-hospital", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: hospitalName }),
    })
      .then((response) => response.json())
      .then((data) => {
        displayResults("results-container", data);
      })
      .catch((error) => {
        console.error("Error searching by hospital name:", error);
      });
  }
  
  // Function to handle searching by city
  function searchByCity() {
    const cityName = document.getElementById("search-city").value;
  
    fetch("/search-city", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: cityName }),
    })
      .then((response) => response.json())
      .then((data) => {
        displayResults("results-container", data);
      })
      .catch((error) => {
        console.error("Error searching by city:", error);
      });
  }
  
  // Function to handle searching by pincode
  function searchByPincode() {
    const pincode = document.getElementById("search-pincode").value;
  
    fetch("/search-pincode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: pincode }),
    })
      .then((response) => response.json())
      .then((data) => {
        displayResults("results-container", data);
      })
      .catch((error) => {
        console.error("Error searching by pincode:", error);
      });
  }