function lookupPostcode() {
      const postcode = document.getElementById('postcode').value.trim();
      if (!postcode) {
        document.getElementById('result').textContent = 'Please enter a postcode.';
        return;
      }
      fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 200 && data.result) {
            const authority = data.result.admin_district; // Local authority name
            document.getElementById('result').textContent = `Local Authority: ${authority}`;
            localStorage.setItem("authority",${authority})
            window.location.href = "${window.location.origin}/government-and-EVI/local-government.html"
          } else {
            document.getElementById('result').textContent = 'Postcode not found.';
          }
        })
        .catch(() => {
          document.getElementById('result').textContent = 'Error contacting API.';
        })
        postcode.addEventListener("submit", (event) => {
            const searchBarValue = document.getElementById("postcode").value; // get input's value everytime the form is submitted
            console.log(searchBarValue);
            event.preventDefault(); // prevent refresh
            // localStorage.setItem("key", searchBarValue);
            // const searchKey = localStorage.getItem("key");
            main(searchBarValue);
        });
      
    }
