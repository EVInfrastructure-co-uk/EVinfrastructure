function AZsearch() {
  // Declare variables
  var input_name, filter_name, input_category, input_category, table, tr, td_name, td_category, i, txtValue;
  input_name = document.getElementById("AZsearch");
  filter_name = input_name.value.toUpperCase();
  input_category = document.getElementById("AZcategory");
  filter_category = input_category.value.toUpperCase();
  table = document.getElementById("AZtable");
  tr = table.getElementsByTagName("tr");

// Loop through all table rows
    for (i = 0; i < tr.length; i++) {
        tr[i].style.display = ""; // display by default
        if (filter_category != "ALL") { // if there is a category
            td_category = tr[i].getElementsByTagName("td")[1];
            if (td_category) {
                txtValue = td_category.textContent || td_category.innerText;
                if (txtValue.toUpperCase().indexOf(filter_category) < 0) {
                    tr[i].style.display = "none";
                }
            }
        }
        td_name = tr[i].getElementsByTagName("td")[0];
        if (td_name) {
            txtValue = td_name.textContent || td_name.innerText;
            if (txtValue.toUpperCase().indexOf(filter_name) < 0) {
                tr[i].style.display = "none";
            }
        }
    }
}