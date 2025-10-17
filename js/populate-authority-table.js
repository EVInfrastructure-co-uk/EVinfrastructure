function populate(slug) {
    fetch('/government-and-EVI/local-government/data/uk_la_evi.json')
  .then(res => res.json())
  .then(allData => {
    // Filter/display data for selected authority
  });
};
