function populate(slug) {
    fetch('/government-and-EVI/local-government/data/uk_la_evi.json')
  .then(response => response.json())
  .then(jsonData => {
    laData = jsonData.resources[0].data;
    // match slug with an authority
    const match = laData.find(entry => entry['gov-uk-slug'] === slug);
    var district = null;
    var unitary = null;
    var county = null;
    var ca = null;

    if (match) {
        document.getElementById('diagnostic').textContent = "There is a match."
    } else {
        document.getElementById('diagnostic').textContent = slug;
    }

    if (match) {
    // assign unitary, district, county or ca
        if  (["CC","LBO","NID","SCO","UA","WPA"].includes(match['local-authority-type'])) {
            document.getElementById('diagnostic').textContent = "Match is unitary."
            unitary = match;
            ca = laData.find(entry => entry['local-authority-code'] === unitary['combined-authority']);
        } else if (["CTY"].includes(match['local-authority-type'])) {
            county = match;
            ca = laData.find(entry => entry['local-authority-code'] === county['combined-authority']);
        } else if (["COMB"].includes(match['local-authority-type'])) {
            ca = match;
        } else if (["NMD"].includes(match['local-authority-type'])) {
            district = match;
            county = laData.find(entry => entry['local-authority-code'] === district['county-la']);
            ca = laData.find(entry => entry['local-authority-code'] === county['combined-authority']);
        } else {
            document.getElementById('result').textContent = 'Data error';
        }
    }

    if (district) {
    //  assign district elements
    document.getElementById('name-district').innerHTML = district['official-name'];
    // needs work document.getElementById('sub-authorities-district').innerHTML = district['sub-authorities'];
    document.getElementById('current-administration-district').innerHTML = district['current-administration'];
    // some code to change the colour based on political stripes document.getElementById('current-administration-district').color = district['current-administration'];
    document.getElementById('administration-since-district').innerHTML = district['administration-since'];
    document.getElementById('households-without-driveway-district').innerHTML = district['households-without-driveway'].toLocaleString("en-GB");
    document.getElementById('households-without-driveway-pct-district').innerHTML = `${district['households-without-driveway-pct']}%`;
    document.getElementById('NEVIS-distribution-district').innerHTML = `${district['NEVIS-distribution'].toLocaleString("en-GB", {maximumFractionDigits:"0"})}%`;
    document.getElementById('NEVIS-distribution-rank-district').innerHTML = `${district['NEVIS-distribution-rank']}/350`;
    document.getElementById('EVI-link-district').innerHTML = `<a href=${district['EVI-link']}>${district['EVI-link']}</a>`;
    document.getElementById('EVI-email-district').innerHTML = `<a href=mailto:${district['EVI-email']}>${district['EVI-email']}</a>`;
    document.getElementById('EVI-portfolio-holder-district').innerHTML = district['EVI-portfolio-holder'];
    document.getElementById('channel-status-district').innerHTML = district['channel-status'];
    if (district['channel-link']) {
        document.getElementById('channel-link-district').innerHTML = `<a href=${district['channel-link']}>${district['channel-link']}</a>`;
    }
    document.getElementById('channel-grant-amount-district').innerHTML = district['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-application-fee-district').innerHTML = district['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-installation-fee-district').innerHTML = district['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-annual-fee-district').innerHTML = district['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-manufacturer-district').innerHTML = district['channel-manufacturer'];
    document.getElementById('LEVI-capital-amount-district').innerHTML = district['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('LEVI-tender-stage-district').innerHTML = district['LEVI-tender-stage'];
    document.getElementById('LEVI-tender-link-district').innerHTML = district['LEVI-tender-link'];
    document.getElementById('LEVI-tender-open-date-district').innerHTML = district['LEVI-tender-open-date'];
    document.getElementById('LEVI-tender-close-date-district').innerHTML = district['LEVI-tender-close-date'];
    document.getElementById('LEVI-CPO(s)-district').innerHTML = district['LEVI-CPO(s)'];
    document.getElementById('LEVI-pilot-capital-amount-district').innerHTML = district['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('LEVI-pilot-CPO(s)-district').innerHTML = district['LEVI-pilot-CPO(s)'];
    document.getElementById('ORCS-total-amount-district').innerHTML = district['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('ORCS-total-charging-devices-district').innerHTML = district['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

    if (county) {
    //  assign county elements
    document.getElementById('name-county').innerHTML = county['official-name'];
    // needs work document.getElementById('sub-authorities-county').innerHTML = county['sub-authorities'];
    document.getElementById('current-administration-county').innerHTML = county['current-administration'];
    // some code to change the colour based on political stripes document.getElementById('current-administration-county').color = county['current-administration'];
    document.getElementById('administration-since-county').innerHTML = county['administration-since'];
    document.getElementById('households-without-driveway-county').innerHTML = county['households-without-driveway'].toLocaleString("en-GB");
    document.getElementById('households-without-driveway-pct-county').innerHTML = `${county['households-without-driveway-pct']}%`;
    document.getElementById('NEVIS-distribution-county').innerHTML = `${county['NEVIS-distribution'].toLocaleString("en-GB", {maximumFractionDigits:"0"})}%`;
    document.getElementById('NEVIS-distribution-rank-county').innerHTML = `${county['NEVIS-distribution-rank']}/350`;
    document.getElementById('EVI-link-county').innerHTML = `<a href=${county['EVI-link']}>${county['EVI-link']}</a>`;
    document.getElementById('EVI-email-county').innerHTML = `<a href=mailto:${county['EVI-email']}>${county['EVI-email']}</a>`;
    document.getElementById('EVI-portfolio-holder-county').innerHTML = county['EVI-portfolio-holder'];
    document.getElementById('channel-status-county').innerHTML = county['channel-status'];
    if (county['channel-link']) {
            document.getElementById('channel-link-county').innerHTML = `<a href=${county['channel-link']}>${county['channel-link']}</a>`;
    }
    document.getElementById('channel-grant-amount-county').innerHTML = county['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-application-fee-county').innerHTML = county['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-installation-fee-county').innerHTML = county['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-annual-fee-county').innerHTML = county['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-manufacturer-county').innerHTML = county['channel-manufacturer'];
    document.getElementById('LEVI-capital-amount-county').innerHTML = county['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('LEVI-tender-stage-county').innerHTML = county['LEVI-tender-stage'];
    document.getElementById('LEVI-tender-link-county').innerHTML = county['LEVI-tender-link'];
    document.getElementById('LEVI-tender-open-date-county').innerHTML = county['LEVI-tender-open-date'];
    document.getElementById('LEVI-tender-close-date-county').innerHTML = county['LEVI-tender-close-date'];
    document.getElementById('LEVI-CPO(s)-county').innerHTML = county['LEVI-CPO(s)'];
    document.getElementById('LEVI-pilot-capital-amount-county').innerHTML = county['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('LEVI-pilot-CPO(s)-county').innerHTML = county['LEVI-pilot-CPO(s)'];
    document.getElementById('ORCS-total-amount-county').innerHTML = county['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('ORCS-total-charging-devices-county').innerHTML = county['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

    if (ca) {
    //  assign ca elements
    document.getElementById('name-CA').innerHTML = ca['official-name'];
    // needs work document.getElementById('sub-authorities-CA').innerHTML = ca['sub-authorities'];
    document.getElementById('current-administration-CA').innerHTML = ca['current-administration'];
    // some code to change the colour based on political stripes document.getElementById('current-administration-CA').color = ca['current-administration'];
    document.getElementById('administration-since-CA').innerHTML = ca['administration-since'];
    document.getElementById('households-without-driveway-CA').innerHTML = ca['households-without-driveway'].toLocaleString("en-GB");
    document.getElementById('households-without-driveway-pct-CA').innerHTML = `${ca['households-without-driveway-pct']}%`;
    document.getElementById('NEVIS-distribution-CA').innerHTML = `${ca['NEVIS-distribution'].toLocaleString("en-GB", {maximumFractionDigits:"0"})}%`;
    document.getElementById('NEVIS-distribution-rank-CA').innerHTML = `${ca['NEVIS-distribution-rank']}/350`;
    document.getElementById('EVI-link-CA').innerHTML = `<a href=${ca['EVI-link']}>${ca['EVI-link']}</a>`;
    document.getElementById('EVI-email-CA').innerHTML = `<a href=mailto:${ca['EVI-email']}>${ca['EVI-email']}</a>`;
    document.getElementById('EVI-portfolio-holder-CA').innerHTML = ca['EVI-portfolio-holder'];
    document.getElementById('channel-status-CA').innerHTML = ca['channel-status'];
    if (ca['channel-link']) {
        document.getElementById('channel-link-CA').innerHTML = `<a href=${ca['channel-link']}>${ca['channel-link']}</a>`;
    }
    document.getElementById('channel-grant-amount-CA').innerHTML = ca['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-application-fee-CA').innerHTML = ca['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-installation-fee-CA').innerHTML = ca['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-annual-fee-CA').innerHTML = ca['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-manufacturer-CA').innerHTML = ca['channel-manufacturer'];
    document.getElementById('LEVI-capital-amount-CA').innerHTML = ca['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('LEVI-tender-stage-CA').innerHTML = ca['LEVI-tender-stage'];
    document.getElementById('LEVI-tender-link-CA').innerHTML = ca['LEVI-tender-link'];
    document.getElementById('LEVI-tender-open-date-CA').innerHTML = ca['LEVI-tender-open-date'];
    document.getElementById('LEVI-tender-close-date-CA').innerHTML = ca['LEVI-tender-close-date'];
    document.getElementById('LEVI-CPO(s)-CA').innerHTML = ca['LEVI-CPO(s)'];
    document.getElementById('LEVI-pilot-capital-amount-CA').innerHTML = ca['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('LEVI-pilot-CPO(s)-CA').innerHTML = ca['LEVI-pilot-CPO(s)'];
    document.getElementById('ORCS-total-amount-CA').innerHTML = ca['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('ORCS-total-charging-devices-CA').innerHTML = ca['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

    if (unitary) {
    //  assign unitary elements
    document.getElementById('name-unitary').innerHTML = unitary['official-name'];
    // needs work document.getElementById('sub-authorities-unitary').innerHTML = unitary['sub-authorities'];
    document.getElementById('current-administration-unitary').innerHTML = unitary['current-administration'];
    // some code to change the colour based on political stripes document.getElementById('current-administration-unitary').color = unitary['current-administration'];
    document.getElementById('administration-since-unitary').innerHTML = unitary['administration-since'];
    document.getElementById('households-without-driveway-unitary').innerHTML = unitary['households-without-driveway'].toLocaleString("en-GB");
    document.getElementById('households-without-driveway-pct-unitary').innerHTML = `${unitary['households-without-driveway-pct']}%`;
    document.getElementById('NEVIS-distribution-unitary').innerHTML = `${unitary['NEVIS-distribution'].toLocaleString("en-GB", {maximumFractionDigits:"0"})}%`;
    document.getElementById('NEVIS-distribution-rank-unitary').innerHTML = `${unitary['NEVIS-distribution-rank']}/350`;
    document.getElementById('EVI-link-unitary').innerHTML = `<a href=${unitary['EVI-link']}>${unitary['EVI-link']}</a>`;
    document.getElementById('EVI-email-unitary').innerHTML = `<a href=mailto:${unitary['EVI-email']}>${unitary['EVI-email']}</a>`;
    document.getElementById('EVI-portfolio-holder-unitary').innerHTML = unitary['EVI-portfolio-holder'];
    document.getElementById('channel-status-unitary').innerHTML = unitary['channel-status'];
    if (unitary['channel-link']) {
        document.getElementById('channel-link-unitary').innerHTML = `<a href=${unitary['channel-link']}>${unitary['channel-link']}</a>`;
    }
    document.getElementById('channel-grant-amount-unitary').innerHTML = unitary['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-application-fee-unitary').innerHTML = unitary['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-installation-fee-unitary').innerHTML = unitary['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-annual-fee-unitary').innerHTML = unitary['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('channel-manufacturer-unitary').innerHTML = unitary['channel-manufacturer'];
    document.getElementById('LEVI-capital-amount-unitary').innerHTML = unitary['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('LEVI-tender-stage-unitary').innerHTML = unitary['LEVI-tender-stage'];
    document.getElementById('LEVI-tender-link-unitary').innerHTML = unitary['LEVI-tender-link'];
    document.getElementById('LEVI-tender-open-date-unitary').innerHTML = unitary['LEVI-tender-open-date'];
    document.getElementById('LEVI-tender-close-date-unitary').innerHTML = unitary['LEVI-tender-close-date'];
    document.getElementById('LEVI-CPO(s)-unitary').innerHTML = unitary['LEVI-CPO(s)'];
    document.getElementById('LEVI-pilot-capital-amount-unitary').innerHTML = unitary['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('LEVI-pilot-CPO(s)-unitary').innerHTML = unitary['LEVI-pilot-CPO(s)'];
    document.getElementById('ORCS-total-amount-unitary').innerHTML = unitary['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
    document.getElementById('ORCS-total-charging-devices-unitary').innerHTML = unitary['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }
})
};
