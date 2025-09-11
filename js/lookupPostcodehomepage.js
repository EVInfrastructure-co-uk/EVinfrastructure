document.getElementById('postcode__form').addEventListener('submit', function(event) {
      event.preventDefault();
      const postcode = document.getElementById('postcode').value.trim();
      if (!postcode) {
        document.getElementById('result').textContent = 'Please enter a postcode.';
        return;
      }
      localStorage.setItem("postcode", postcode);
      window.location.href = `/government-and-EVI/local-government.html#`;
    });
