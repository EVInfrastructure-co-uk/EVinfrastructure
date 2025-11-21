const authority_list = document.getElementById('authority_select');

fetch('/government/local-government/data/uk_la_evi.json')
  .then(response => response.json())
  .then(jsonData => {
    laData = jsonData.resources[0].data;

    var authority_array = [];

    laData.forEach(authority => {
        if  (authority['local-authority-type'] != "COMB") {
          authority_array.push(authority['official-name']); 
        }
      });

    authority_array = authority_array.sort();

    for (var i = 0, length = authority_array.length; i < length; i++) {
      const authority = laData.find(authority => authority['official-name'] === authority_array[i]);
      const option = document.createElement('option');
      option.value = authority['gov-uk-slug'];
      option.textContent = authority['official-name'];
      authority_list.appendChild(option);
    };

    })

function authority_page() {
    const slug = authority_list.value;
    window.location.href = `/government/local-government/${slug}`;
}