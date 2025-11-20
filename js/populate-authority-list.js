fetch('/government/local-government/data/uk_la_evi.json')
  .then(response => response.json())
  .then(jsonData => {
    laData = jsonData.resources[0].data;

    const authority_list = document.getElementById('authority_select');

    laData.forEach(authority => {
        if  (authority['local-authority-type'] != "COMB") {
            const option = document.createElement('option');
            option.value = authority['slug'];
            option.textContent = authority['nice-name'];
            authority_list.appendChild(option);
        }
      });
    })