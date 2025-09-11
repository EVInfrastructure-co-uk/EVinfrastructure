window.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('postcode') {
            const postcode = document.getElementById('postcode').value.trim();
      return}
            else             
                  {const postcode = localStorage.getItem("postcode")};
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
          } else {
            document.getElementById('result').textContent = 'Postcode not found.';
          }
        })
        .catch(() => {
          document.getElementById('result').textContent = 'Error contacting API.';
        });
});
