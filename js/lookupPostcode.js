window.addEventListener('DOMContentLoaded', function() {
      const postcode = localStorage.getItem("postcode");
            const input = document.getElementById('postcode').value.trim();          
      if (postcode) {
        input.value = postcode;
      lookupAndDisplay(postcode);
      }

document.getElementById('postcode__form').addEventListener('submit', function(event) {
    event.preventDefault();
    const submittedPostcode = input.value.trim();
    if (submittedPostcode) {
      localStorage.setItem("postcode", submittedPostcode);
    }
    lookupAndDisplay(submittedPostcode);
  });
});

function lookupAndDisplay(postcode) {

  if (!postcode) {
    resultDiv.textContent = 'Please enter a postcode.';
    return;
  }
      fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 200 && data.result) {
            const authority = data.result.admin_district; // Local authority name
            document.getElementById('result').textContent = `Local Authority: ${authority}`;
          } else {
            document.getElementById('result').textContent = 'Postcode not found.';
          }
        })
        .catch(() => {
          document.getElementById('result').textContent = 'Error contacting API.';
        });
});
