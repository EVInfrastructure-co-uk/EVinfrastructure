window.addEventListener('DOMContentLoaded', function() {
      const postcode = localStorage.getItem("postcode");
      const input = document.getElementById('postcode');          
      if (postcode) {
        input.value = postcode;
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
    document.getElementById('result').textContent = 'Please enter a postcode.';
    return;
  }
      
      fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 200 && data.result) {
            const authority = data.result.admin_district; // Local authority name
            const gss = data.result.codes.admin_district; // Local authority GSS code
            
                fetch('/government-and-EVI/local-government/_data/uk_evi_la.json')
                      .then(response => response.json())
                      .then(jsonData => {
                            const laData = jsonData.resources[0].data;
                            const match = laData.find(entry => entry['gss-code'] === gss);
            
                            if (match) {
                                  const slug = match['gov-uk-slug'];
                                  window.location.href = `/government-and-EVI/local-government/${slug}`;
                                  document.getElementById('result').textContent = `Local Authority: ${authority}. Slug: ${slug}`;
                            } else {
                                  document.getElementById('result').textContent = 'Local authority not found in EVI dataset.';
                            }
                      })
                .catch(() => {
                      document.getElementById('result').textContect = 'Error loading local authority data.';
                });
          } else {
            document.getElementById('result').textContent = 'Postcode not found.';
          }
        })
        .catch(() => {
          document.getElementById('result').textContent = 'Error contacting API.';
        });
};
