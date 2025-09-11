function lookupPostcodehomepage() {
      const postcode = document.getElementById('postcode').value.trim();
      if (!postcode) {
        document.getElementById('result').textContent = 'Please enter a postcode.';
        return;
      }
      postcode.addEventListener("submit", (event) => {
      const searchBarValue = document.getElementById("postcode__form").value;
      event.preventDefault();
      localStorage.setItem("postcode", postcode);
      window.location.href = `government-and-EVI/local-government.html`;
    });
     ;
    }
