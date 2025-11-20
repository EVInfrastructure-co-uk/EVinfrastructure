const authority_list = document.getElementById('authority_select');

fetch('/government/local-government/data/uk_la_evi.json')
  .then(response => response.json())
  .then(jsonData => {
    laData = jsonData.resources[0].data;

    // var authority_array

    laData.forEach(authority => {
        if  (authority['local-authority-type'] != "COMB") {
            const option = document.createElement('option');
            option.value = authority['gov-uk-slug'];
            option.textContent = authority['nice-name'];
            authority_list.appendChild(option);
        }
      });

    //   var authority_array = birdList.getElementsByTagName("li");

    // birds = Array.prototype.slice.call(birds).sort(function(a, b) {
    //     return a.firstChild.data.toLowerCase().localeCompare(b.firstChild.data.toLowerCase());
    // });

    // for (var i = 0, length = birds.length; i < length; i++) {
    //                 const option = document.createElement('option');
    //         option.value = authority['gov-uk-slug'];
    //         option.textContent = authority['nice-name'];
    //         authority_list.appendChild(birds[i]);
    // };

    })

function authority_page() {
    const slug = authority_list.value;
    window.location.href = `/government/local-government/${slug}`;
}