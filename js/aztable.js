function AZsearch() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("AZsearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("AZtable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function AZcategory() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("AZcategory");
  filter = input.value.toUpperCase();
  table = document.getElementById("AZtable");
  tr = table.getElementsByTagName("tr");

  if (input != "all") {
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }
    }
  } else {
    for (i = 0; i < tr.length; i++)
        tr[i].style.display = "";
  }
}