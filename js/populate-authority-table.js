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
    var ca2 = null;
    var ca3 = null;
    var ca4 = null;

    if (match) {
    // assign unitary, district, county or ca
        if  (["SCO","WPA"].includes(match['local-authority-type'])) { // Scotland or Wales
            unitary = match;
            ca = laData.find(entry => entry['local-authority-code'] === unitary['combined-authority']);
            if (ca) {
                document.getElementById('name-CA').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                var ca_sub_authorities = `<strong>${unitary['nice-name']}</strong>`;
            }
        } else if  (match['local-authority-type'] == "NID") { // Northern Ireland
            unitary = match;
            // ca = laData.find(entry => entry['local-authority-code'] === unitary['combined-authority']);
            // if (ca) {
            //     document.getElementById('name-CA').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
            //     var ca_sub_authorities = `<strong>${unitary['nice-name']}</strong>`;
            // }
            ca2 = laData.find(entry => entry['local-authority-code'] === unitary['combined-authority-2']);
            // if (ca2) {
                document.getElementById('combined-authority-2-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-type').innerHTML = ca2['combined-authority-type'];
                var ca2_sub_authorities = `<strong>${unitary['nice-name']}</strong>`;
            // }
            // ca3 = laData.find(entry => entry['local-authority-code'] === unitary['combined-authority-3']);
            // if (ca3) {
            //     document.getElementById('combined-authority-3-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
            //     document.getElementById('combined-authority-3-type').innerHTML = ca3['combined-authority-type'];
            //     var ca3_sub_authorities = `<strong>${unitary['nice-name']}</strong>`;
            // }
        } else if  (["CC","LBO","UA","MD"].includes(match['local-authority-type'])) { // London boroughs, England unitary authorities, England metropolitan districts
            unitary = match;
            ca = laData.find(entry => entry['local-authority-code'] === unitary['combined-authority']);
            if (ca) {
                document.getElementById('name-CA').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                var ca_sub_authorities = `<strong>${unitary['nice-name']}</strong>`;
            }
            ca2 = laData.find(entry => entry['local-authority-code'] === unitary['combined-authority-2']);
            if (ca2) {
                document.getElementById('combined-authority-2-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-type').innerHTML = ca2['combined-authority-type'];
                var ca2_sub_authorities = `<strong>${unitary['nice-name']}</strong>`;
            }
            ca3 = laData.find(entry => entry['local-authority-code'] === unitary['combined-authority-3']);
            if (ca3) {
                document.getElementById('combined-authority-3-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-type').innerHTML = ca3['combined-authority-type'];
                var ca3_sub_authorities = `<strong>${unitary['nice-name']}</strong>`;
            }
        } else if (["CTY"].includes(match['local-authority-type'])) {
            county = match;
            ca = laData.find(entry => entry['local-authority-code'] === county['combined-authority']);
            document.getElementById('name-county').innerHTML = county['official-name'];
            document.getElementById('name-county-channels').innerHTML = county['official-name'];
            document.getElementById('name-county-LEVI').innerHTML = county['official-name'];
            document.getElementById('name-county-ORCS').innerHTML = county['official-name'];
            if (ca) {
                document.getElementById('name-CA').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                var ca_sub_authorities = `<strong>${county['nice-name']}</strong>`;
            }
            ca2 = laData.find(entry => entry['local-authority-code'] === county['combined-authority-2']);
            if (ca2) {
                document.getElementById('combined-authority-2-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-type').innerHTML = ca2['combined-authority-type'];
                var ca2_sub_authorities = `<strong>${county['nice-name']}</strong>`;
            }
            ca3 = laData.find(entry => entry['local-authority-code'] === county['combined-authority-3']);
            if (ca3) {
                document.getElementById('combined-authority-3-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-type').innerHTML = ca3['combined-authority-type'];
                var ca3_sub_authorities = `<strong>${county['nice-name']}</strong>`;
            }
            var county_sub_authorities = "";
        } else if (["COMB"].includes(match['local-authority-type'])) {
            if (match['region'] != "Northern Ireland") {
                var ca_sub_authorities = "";
                ca = match;
                document.getElementById('name-CA').innerHTML = ca['official-name'];
                document.getElementById('name-CA-LEVI').innerHTML = ca['official-name'];
                document.getElementById('name-CA-ORCS').innerHTML = ca['official-name'];
                if (ca['combined-authority-type']) {
                    document.getElementById('combined-authority-type').innerHTML = ca['combined-authority-type'];
                } else {
                    document.getElementById('combined-authority-type').innerHTML ="LEVI collaboration"
                }
                if (ca['region'] != "Scotland" && ca['region'] != "Wales") {
                    document.getElementById('name-CA-channels').innerHTML = ca['official-name'];
                }
            } else {
                var ca2_sub_authorities = "";
                ca2 = match;
                document.getElementById('combined-authority-2-name').innerHTML = ca['official-name'];
                document.getElementById('combined-authority-2-name-channels').innerHTML = ca['official-name'];
                document.getElementById('combined-authority-2-name-ORCS').innerHTML = ca['official-name'];
                document.getElementById('combined-authority-2-type').innerHTML = ca2['combined-authority-type'];
            }
        } else if (["NMD"].includes(match['local-authority-type'])) {
            district = match;
            county = laData.find(entry => entry['local-authority-code'] === district['county-la']);
            ca = laData.find(entry => entry['local-authority-code'] === county['combined-authority']);
            // try county combined authorities first
            ca2 = laData.find(entry => entry['local-authority-code'] === county['combined-authority-2']); 
            ca3 = laData.find(entry => entry['local-authority-code'] === county['combined-authority-3']);
            // then county has no ca2 try district ca2
            if (!(ca2)) {
                ca2 = laData.find(entry => entry['local-authority-code'] === district['combined-authority-2']); 
            // if county has ca2 but no ca3, try district ca2 to slot into ca3
            } else if (!(ca3)) {
                ca3 = laData.find(entry => entry['local-authority-code'] === district['combined-authority-2']); 
            // if county has filled up ca2 and ca3, district ca2 goes to ca4 (only South Holland)
            } else {
                ca4 = laData.find(entry => entry['local-authority-code'] === district['combined-authority-2']);
            }
            
            document.getElementById('name-county').innerHTML = `<a href="/government-and-EVI/local-government/${county['gov-uk-slug']}">${county['official-name']}</a>`;
            document.getElementById('name-county-channels').innerHTML = `<a href="/government-and-EVI/local-government/${county['gov-uk-slug']}">${county['official-name']}</a>`;
            document.getElementById('name-county-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${county['gov-uk-slug']}">${county['official-name']}</a>`;
            document.getElementById('name-county-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${county['gov-uk-slug']}">${county['official-name']}</a>`;
            var county_sub_authorities = `<strong>${district['nice-name']}</strong>`;
            if (ca) {
                document.getElementById('name-CA').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                document.getElementById('name-CA-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca['gov-uk-slug']}">${ca['official-name']}</a>`;
                var ca_sub_authorities = "";
            }
            if (ca2) {
                document.getElementById('combined-authority-2-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-name-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca2['gov-uk-slug']}">${ca2['official-name']}</a>`;
                document.getElementById('combined-authority-2-type').innerHTML = ca2['combined-authority-type'];
                var ca2_sub_authorities = "";
            }
            if (ca3) {
                document.getElementById('combined-authority-3-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-name-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca3['gov-uk-slug']}">${ca3['official-name']}</a>`;
                document.getElementById('combined-authority-3-type').innerHTML = ca3['combined-authority-type'];
                var ca3_sub_authorities = "";
            }
            if (ca4) {
                document.getElementById('combined-authority-4-name').innerHTML = `<a href="/government-and-EVI/local-government/${ca4['gov-uk-slug']}">${ca4['official-name']}</a>`;
                document.getElementById('combined-authority-4-name-channels').innerHTML = `<a href="/government-and-EVI/local-government/${ca4['gov-uk-slug']}">${ca4['official-name']}</a>`;
                document.getElementById('combined-authority-4-name-LEVI').innerHTML = `<a href="/government-and-EVI/local-government/${ca4['gov-uk-slug']}">${ca4['official-name']}</a>`;
                document.getElementById('combined-authority-4-name-ORCS').innerHTML = `<a href="/government-and-EVI/local-government/${ca4['gov-uk-slug']}">${ca4['official-name']}</a>`;
                document.getElementById('combined-authority-4-type').innerHTML = ca4['combined-authority-type'];
                var ca4_sub_authorities = "";
            }
        } else {
            document.getElementById('result').textContent = 'Data error';
        }
    }

    if (district) {
        //  assign district elements
        document.getElementById('name-district').innerHTML = district['official-name'];
        document.getElementById('name-district-channels').innerHTML = district['official-name'];
        document.getElementById('name-district-LEVI').innerHTML = district['official-name'];
        document.getElementById('name-district-ORCS').innerHTML = district['official-name'];
        document.getElementById('current-administration-district').innerHTML = district['current-administration'];
        // some code to change the colour based on political stripes document.getElementById('current-administration-district').color = district['current-administration'];
        document.getElementById('households-without-driveway-district').innerHTML = district['households-without-driveway'].toLocaleString("en-GB");
        document.getElementById('households-without-driveway-pct-district').innerHTML = `${district['households-without-driveway-pct']}%`;
        document.getElementById('NEVIS-distribution-district').innerHTML = `${Math.round(district['NEVIS-distribution'])}%`;
        document.getElementById('NEVIS-distribution-rank-district').innerHTML = `${district['NEVIS-distribution-rank']}/350`;
        if (district['EVI-link']) {
            document.getElementById('EVI-link-district').innerHTML = `<a href=${district['EVI-link']}>${district['EVI-link']}</a>`;
        }
        if (district['EVI-email']) {
            document.getElementById('EVI-email-district').innerHTML = `<a href=mailto:${district['EVI-email']}>${district['EVI-email']}</a>`;
        }
        document.getElementById('EVI-portfolio-holder-district').innerHTML = district['EVI-portfolio-holder'];
        document.getElementById('ORCS-total-amount-district').innerHTML = district['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        document.getElementById('ORCS-total-charging-devices-district').innerHTML = district['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

    if (county) {
        //  assign county elements
        // sub-authorities
        laData.filter(entry => entry['county-la'] === county['local-authority-code'] && entry !== match).forEach(element => {
            if (county_sub_authorities == "") {
                county_sub_authorities = `<a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
            } else county_sub_authorities = county_sub_authorities + `, <a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
        });
        document.getElementById('sub-authorities-county').innerHTML = county_sub_authorities;
        document.getElementById('current-administration-county').innerHTML = county['current-administration'];
        // some code to change the colour based on political stripes document.getElementById('current-administration-county').color = county['current-administration'];
        document.getElementById('households-without-driveway-county').innerHTML = county['households-without-driveway'].toLocaleString("en-GB");
        document.getElementById('households-without-driveway-pct-county').innerHTML = `${county['households-without-driveway-pct']}%`;
        if (county['EVI-link']) {
            document.getElementById('EVI-link-county').innerHTML = `<a href=${county['EVI-link']}>${county['EVI-link']}</a>`;
        }
        if (county['EVI-email']) {
            document.getElementById('EVI-email-county').innerHTML = `<a href=mailto:${county['EVI-email']}>${county['EVI-email']}</a>`;
        }
        document.getElementById('EVI-portfolio-holder-county').innerHTML = county['EVI-portfolio-holder'];
        document.getElementById('channel-status-county').innerHTML = county['channel-status'];
        if (county['channel-grant-amount']) {    
            document.getElementById('channel-grant-amount-county').innerHTML = county['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        }
        if ((county['channel-status'])) {
            if (county['channel-link']) {
                document.getElementById('channel-link-county').innerHTML = `<a href=${county['channel-link']}>${county['channel-link']}</a>`;
            }
            if (county['channel-application-fee'] == null || isNaN(county['channel-application-fee'])) {
            document.getElementById('channel-application-fee-county').innerHTML = county['channel-application-fee']
            } else {
                document.getElementById('channel-application-fee-county').innerHTML = county['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (county['channel-installation-fee'] == null || isNaN(county['channel-installation-fee'])) {
            document.getElementById('channel-installation-fee-county').innerHTML = county['channel-installation-fee']
            } else {
                document.getElementById('channel-installation-fee-county').innerHTML = county['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (county['channel-annual-fee'] == null || isNaN(county['channel-annual-fee'])) {
            document.getElementById('channel-annual-fee-county').innerHTML = county['channel-annual-fee']
            } else {
                document.getElementById('channel-annual-fee-county').innerHTML = county['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            document.getElementById('channel-manufacturer-county').innerHTML = county['channel-manufacturer'];
        }
        if (county['LEVI-capital-amount']) {
            document.getElementById('LEVI-capital-amount-county').innerHTML = county['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-tender-stage-county').innerHTML = county['LEVI-tender-stage'];
            document.getElementById('LEVI-tender-link-county').innerHTML = county['LEVI-tender-link'];
            document.getElementById('LEVI-tender-open-date-county').innerHTML = county['LEVI-tender-open-date'];
            document.getElementById('LEVI-tender-close-date-county').innerHTML = county['LEVI-tender-close-date'];
            document.getElementById('LEVI-CPO(s)-county').innerHTML = county['LEVI-CPO(s)'];
        }
        if (county['LEVI-pilot-capital-amount']) {
            document.getElementById('LEVI-pilot-capital-amount-county').innerHTML = county['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-pilot-CPO(s)-county').innerHTML = county['LEVI-pilot-CPO(s)'];
        }
        document.getElementById('ORCS-total-amount-county').innerHTML = county['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        document.getElementById('ORCS-total-charging-devices-county').innerHTML = county['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

    if (unitary) {
        //  assign unitary elements
        document.getElementById('name-unitary').innerHTML = unitary['official-name'];
        document.getElementById('name-unitary-channels').innerHTML = unitary['official-name'];
        if (unitary['region'] != "Northern Ireland") {
            document.getElementById('name-unitary-LEVI').innerHTML = unitary['official-name'];
        }
        document.getElementById('name-unitary-ORCS').innerHTML = unitary['official-name'];
        // needs work document.getElementById('sub-authorities-unitary').innerHTML = unitary['sub-authorities'];
        document.getElementById('current-administration-unitary').innerHTML = unitary['current-administration'];
        // some code to change the colour based on political stripes document.getElementById('current-administration-unitary').color = unitary['current-administration'];
        if (unitary['region'] != "Northern Ireland") {
            document.getElementById('households-without-driveway-unitary').innerHTML = unitary['households-without-driveway'].toLocaleString("en-GB");
            document.getElementById('households-without-driveway-pct-unitary').innerHTML = `${unitary['households-without-driveway-pct']}%`;
            document.getElementById('NEVIS-distribution-unitary').innerHTML = `${Math.round(unitary['NEVIS-distribution'])}%`;
            document.getElementById('NEVIS-distribution-rank-unitary').innerHTML = `${unitary['NEVIS-distribution-rank']}/350`;
        }
        if (unitary['EVI-link']) {
            document.getElementById('EVI-link-unitary').innerHTML = `<a href=${unitary['EVI-link']}>${unitary['EVI-link']}</a>`;
        }
        if (unitary['EVI-email']) {
            document.getElementById('EVI-email-unitary').innerHTML = `<a href=mailto:${unitary['EVI-email']}>${unitary['EVI-email']}</a>`;
        }
        document.getElementById('EVI-portfolio-holder-unitary').innerHTML = unitary['EVI-portfolio-holder'];
        document.getElementById('channel-status-unitary').innerHTML = unitary['channel-status'];
        if (unitary['channel-grant-amount']) {
            document.getElementById('channel-grant-amount-unitary').innerHTML = unitary['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        }
        if ((unitary['channel-status'])) {
            if (unitary['channel-link']) {
                document.getElementById('channel-link-unitary').innerHTML = `<a href=${unitary['channel-link']}>${unitary['channel-link']}</a>`;
            }
            if (unitary['channel-application-fee'] == null || isNaN(unitary['channel-application-fee'])) {
            document.getElementById('channel-application-fee-unitary').innerHTML = unitary['channel-application-fee']
            } else {
                document.getElementById('channel-application-fee-unitary').innerHTML = unitary['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (unitary['channel-installation-fee'] == null || isNaN(unitary['channel-installation-fee'])) {
            document.getElementById('channel-installation-fee-unitary').innerHTML = unitary['channel-installation-fee']
            } else {
                document.getElementById('channel-installation-fee-unitary').innerHTML = unitary['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (unitary['channel-annual-fee'] == null || isNaN(unitary['channel-annual-fee'])) {
            document.getElementById('channel-annual-fee-unitary').innerHTML = unitary['channel-annual-fee']
            } else {
                document.getElementById('channel-annual-fee-unitary').innerHTML = unitary['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            document.getElementById('channel-manufacturer-unitary').innerHTML = unitary['channel-manufacturer'];
        }
        if (unitary['LEVI-capital-amount']) {
            document.getElementById('LEVI-capital-amount-unitary').innerHTML = unitary['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-tender-stage-unitary').innerHTML = unitary['LEVI-tender-stage'];
            document.getElementById('LEVI-tender-link-unitary').innerHTML = unitary['LEVI-tender-link'];
            document.getElementById('LEVI-tender-open-date-unitary').innerHTML = unitary['LEVI-tender-open-date'];
            document.getElementById('LEVI-tender-close-date-unitary').innerHTML = unitary['LEVI-tender-close-date'];
            document.getElementById('LEVI-CPO(s)-unitary').innerHTML = unitary['LEVI-CPO(s)'];
        }
        if (unitary['LEVI-pilot-capital-amount']) {
            document.getElementById('LEVI-pilot-capital-amount-unitary').innerHTML = unitary['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-pilot-CPO(s)-unitary').innerHTML = unitary['LEVI-pilot-CPO(s)'];
        }
        document.getElementById('ORCS-total-amount-unitary').innerHTML = unitary['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        document.getElementById('ORCS-total-charging-devices-unitary').innerHTML = unitary['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

    if (ca) {
        //  assign ca elements
        // find sub authorities
        laData.filter(entry => entry['combined-authority'] === ca['local-authority-code'] && entry !== match).forEach(element => {
            if (ca_sub_authorities == "") {
                ca_sub_authorities = `<a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
            } else ca_sub_authorities = ca_sub_authorities + `, <a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
        });
        document.getElementById('sub-authorities-CA').innerHTML = ca_sub_authorities;
        document.getElementById('current-administration-CA').innerHTML = ca['current-administration'];
        // some code to change the colour based on political stripes document.getElementById('current-administration-CA').color = ca['current-administration'];
        if (ca['households-without-driveway']) {
            document.getElementById('households-without-driveway-CA').innerHTML = ca['households-without-driveway'].toLocaleString("en-GB");
            document.getElementById('households-without-driveway-pct-CA').innerHTML = `${ca['households-without-driveway-pct']}%`;
        }
        if (ca['EVI-link']) {
            document.getElementById('EVI-link-CA').innerHTML = `<a href=${ca['EVI-link']}>${ca['EVI-link']}</a>`;
        }
        if (ca['EVI-email']) {
            document.getElementById('EVI-email-CA').innerHTML = `<a href=mailto:${ca['EVI-email']}>${ca['EVI-email']}</a>`;
        }
        document.getElementById('EVI-portfolio-holder-CA').innerHTML = ca['EVI-portfolio-holder'];
        if (ca['channel-grant-amount']) {
            document.getElementById('channel-grant-amount-CA').innerHTML = ca['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('channel-status-CA').innerHTML = ca['channel-status'];       
        }
        if ((ca['channel-status']) && (ca['channel-grant-amount'])) {
            if (ca['channel-link']) {
                document.getElementById('channel-link-CA').innerHTML = `<a href=${ca['channel-link']}>${ca['channel-link']}</a>`;
            }
            if (ca['channel-application-fee'] == null || isNaN(ca['channel-application-fee'])) {
            document.getElementById('channel-application-fee-CA').innerHTML = ca['channel-application-fee']
            } else {
                document.getElementById('channel-application-fee-CA').innerHTML = ca['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (ca['channel-installation-fee'] == null || isNaN(ca['channel-installation-fee'])) {
            document.getElementById('channel-installation-fee-CA').innerHTML = ca['channel-installation-fee']
            } else {
                document.getElementById('channel-installation-fee-CA').innerHTML = ca['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (ca['channel-annual-fee'] == null || isNaN(ca['channel-annual-fee'])) {
            document.getElementById('channel-annual-fee-CA').innerHTML = ca['channel-annual-fee']
            } else {
                document.getElementById('channel-annual-fee-CA').innerHTML = ca['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            document.getElementById('channel-manufacturer-CA').innerHTML = ca['channel-manufacturer'];
        }
        if (ca['LEVI-capital-amount']) {
            document.getElementById('LEVI-capital-amount-CA').innerHTML = ca['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-tender-stage-CA').innerHTML = ca['LEVI-tender-stage'];
            document.getElementById('LEVI-tender-link-CA').innerHTML = ca['LEVI-tender-link'];
            document.getElementById('LEVI-tender-open-date-CA').innerHTML = ca['LEVI-tender-open-date'];
            document.getElementById('LEVI-tender-close-date-CA').innerHTML = ca['LEVI-tender-close-date'];
            document.getElementById('LEVI-CPO(s)-CA').innerHTML = ca['LEVI-CPO(s)'];
        }
        if (ca['LEVI-pilot-capital-amount']) {
            document.getElementById('LEVI-pilot-capital-amount-CA').innerHTML = ca['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-pilot-CPO(s)-CA').innerHTML = ca['LEVI-pilot-CPO(s)'];
        }
        document.getElementById('ORCS-total-amount-CA').innerHTML = ca['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        document.getElementById('ORCS-total-charging-devices-CA').innerHTML = ca['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

    if (ca2) {
        //  assign ca2 elements
        // find sub authorities
        laData.filter(entry => (entry['combined-authority-2'] === ca2['local-authority-code'] && entry !== match).forEach(element => {
            if (ca2_sub_authorities == "") {
                ca2_sub_authorities = `<a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
            } else ca2_sub_authorities = ca2_sub_authorities + `, <a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
        });
        document.getElementById('sub-authorities-CA2').innerHTML = ca2_sub_authorities;
        document.getElementById('current-administration-CA2').innerHTML = ca2['current-administration'];
        // some code to change the colour based on political stripes document.getElementById('current-administration-CA2').color = ca2['current-administration'];
        if (ca2['households-without-driveway']) {
            document.getElementById('households-without-driveway-CA2').innerHTML = ca2['households-without-driveway'].toLocaleString("en-GB");
            document.getElementById('households-without-driveway-pct-CA2').innerHTML = `${ca2['households-without-driveway-pct']}%`;
        }
        if (ca2['EVI-link']) {
            document.getElementById('EVI-link-CA2').innerHTML = `<a href=${ca2['EVI-link']}>${ca2['EVI-link']}</a>`;
        }
        if (ca2['EVI-email']) {
            document.getElementById('EVI-email-CA2').innerHTML = `<a href=mailto:${ca2['EVI-email']}>${ca2['EVI-email']}</a>`;
        }
        document.getElementById('EVI-portfolio-holder-CA2').innerHTML = ca2['EVI-portfolio-holder'];
        if (ca2['channel-grant-amount']) {
            document.getElementById('channel-grant-amount-CA2').innerHTML = ca2['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('channel-status-CA2').innerHTML = ca2['channel-status'];       
        }
        if ((ca2['channel-status']) && (ca2['channel-grant-amount'])) {
            if (ca2['channel-link']) {
                document.getElementById('channel-link-CA2').innerHTML = `<a href=${ca2['channel-link']}>${ca2['channel-link']}</a>`;
            }
            if (ca2['channel-application-fee'] == null || isNaN(ca2['channel-application-fee'])) {
            document.getElementById('channel-application-fee-CA2').innerHTML = ca2['channel-application-fee']
            } else {
                document.getElementById('channel-application-fee-CA2').innerHTML = ca2['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (ca2['channel-installation-fee'] == null || isNaN(ca2['channel-installation-fee'])) {
            document.getElementById('channel-installation-fee-CA2').innerHTML = ca2['channel-installation-fee']
            } else {
                document.getElementById('channel-installation-fee-CA2').innerHTML = ca2['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (ca2['channel-annual-fee'] == null || isNaN(ca2['channel-annual-fee'])) {
            document.getElementById('channel-annual-fee-CA2').innerHTML = ca2['channel-annual-fee']
            } else {
                document.getElementById('channel-annual-fee-CA2').innerHTML = ca2['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            document.getElementById('channel-manufacturer-CA2').innerHTML = ca2['channel-manufacturer'];
        }
        if (ca2['LEVI-capital-amount']) {
            document.getElementById('LEVI-capital-amount-CA2').innerHTML = ca2['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-tender-stage-CA2').innerHTML = ca2['LEVI-tender-stage'];
            document.getElementById('LEVI-tender-link-CA2').innerHTML = ca2['LEVI-tender-link'];
            document.getElementById('LEVI-tender-open-date-CA2').innerHTML = ca2['LEVI-tender-open-date'];
            document.getElementById('LEVI-tender-close-date-CA2').innerHTML = ca2['LEVI-tender-close-date'];
            document.getElementById('LEVI-CPO(s)-CA2').innerHTML = ca2['LEVI-CPO(s)'];
        }
        if (ca2['LEVI-pilot-capital-amount']) {
            document.getElementById('LEVI-pilot-capital-amount-CA2').innerHTML = ca2['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-pilot-CPO(s)-CA2').innerHTML = ca2['LEVI-pilot-CPO(s)'];
        }
        document.getElementById('ORCS-total-amount-CA2').innerHTML = ca2['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        document.getElementById('ORCS-total-charging-devices-CA2').innerHTML = ca2['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

    if (ca3) {
        //  assign ca3 elements
        // find sub authorities
        laData.filter(entry => (entry['combined-authority-2'] === ca3['local-authority-code'] || entry['combined-authority-3'] === ca3['local-authority-code'])  && entry !== match).forEach(element => {
            if (ca3_sub_authorities == "") {
                ca3_sub_authorities = `<a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
            } else ca3_sub_authorities = ca3_sub_authorities + `, <a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
        });
        document.getElementById('sub-authorities-CA3').innerHTML = ca3_sub_authorities;
        document.getElementById('current-administration-CA3').innerHTML = ca3['current-administration'];
        // some code to change the colour based on political stripes document.getElementById('current-administration-CA3').color = ca3['current-administration'];
        if (ca3['households-without-driveway']) {
            document.getElementById('households-without-driveway-CA3').innerHTML = ca3['households-without-driveway'].toLocaleString("en-GB");
            document.getElementById('households-without-driveway-pct-CA3').innerHTML = `${ca3['households-without-driveway-pct']}%`;
        }
        if (ca3['EVI-link']) {
            document.getElementById('EVI-link-CA3').innerHTML = `<a href=${ca3['EVI-link']}>${ca3['EVI-link']}</a>`;
        }
        if (ca3['EVI-email']) {
            document.getElementById('EVI-email-CA3').innerHTML = `<a href=mailto:${ca3['EVI-email']}>${ca3['EVI-email']}</a>`;
        }
        document.getElementById('EVI-portfolio-holder-CA3').innerHTML = ca3['EVI-portfolio-holder'];
        if (ca3['channel-grant-amount']) {
            document.getElementById('channel-grant-amount-CA3').innerHTML = ca3['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('channel-status-CA3').innerHTML = ca3['channel-status'];       
        }
        if ((ca3['channel-status']) && (ca3['channel-grant-amount'])) {
            if (ca3['channel-link']) {
                document.getElementById('channel-link-CA3').innerHTML = `<a href=${ca3['channel-link']}>${ca3['channel-link']}</a>`;
            }
            if (ca3['channel-application-fee'] == null || isNaN(ca3['channel-application-fee'])) {
            document.getElementById('channel-application-fee-CA3').innerHTML = ca3['channel-application-fee']
            } else {
                document.getElementById('channel-application-fee-CA3').innerHTML = ca3['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (ca3['channel-installation-fee'] == null || isNaN(ca3['channel-installation-fee'])) {
            document.getElementById('channel-installation-fee-CA3').innerHTML = ca3['channel-installation-fee']
            } else {
                document.getElementById('channel-installation-fee-CA3').innerHTML = ca3['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (ca3['channel-annual-fee'] == null || isNaN(ca3['channel-annual-fee'])) {
            document.getElementById('channel-annual-fee-CA3').innerHTML = ca3['channel-annual-fee']
            } else {
                document.getElementById('channel-annual-fee-CA3').innerHTML = ca3['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            document.getElementById('channel-manufacturer-CA3').innerHTML = ca3['channel-manufacturer'];
        }
        if (ca3['LEVI-capital-amount']) {
            document.getElementById('LEVI-capital-amount-CA3').innerHTML = ca3['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-tender-stage-CA3').innerHTML = ca3['LEVI-tender-stage'];
            document.getElementById('LEVI-tender-link-CA3').innerHTML = ca3['LEVI-tender-link'];
            document.getElementById('LEVI-tender-open-date-CA3').innerHTML = ca3['LEVI-tender-open-date'];
            document.getElementById('LEVI-tender-close-date-CA3').innerHTML = ca3['LEVI-tender-close-date'];
            document.getElementById('LEVI-CPO(s)-CA3').innerHTML = ca3['LEVI-CPO(s)'];
        }
        if (ca3['LEVI-pilot-capital-amount']) {
            document.getElementById('LEVI-pilot-capital-amount-CA3').innerHTML = ca3['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-pilot-CPO(s)-CA3').innerHTML = ca3['LEVI-pilot-CPO(s)'];
        }
        document.getElementById('ORCS-total-amount-CA3').innerHTML = ca3['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        document.getElementById('ORCS-total-charging-devices-CA3').innerHTML = ca3['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }

if (ca4) {
        //  assign ca4 elements
        // find sub authorities
        laData.filter(entry => (entry['combined-authority-2'] === ca4['local-authority-code'] || entry['combined-authority-3'] === ca4['local-authority-code']) && entry !== match).forEach(element => {
            if (ca4_sub_authorities == "") {
                ca4_sub_authorities = `<a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
            } else ca4_sub_authorities = ca4_sub_authorities + `, <a href="/government-and-EVI/local-government/${element['gov-uk-slug']}">${element['nice-name']}</a>`;
        });
        document.getElementById('sub-authorities-CA4').innerHTML = ca4_sub_authorities;
        document.getElementById('current-administration-CA4').innerHTML = ca4['current-administration'];
        // some code to change the colour based on political stripes document.getElementById('current-administration-CA4').color = ca4['current-administration'];
        if (ca4['households-without-driveway']) {
            document.getElementById('households-without-driveway-CA4').innerHTML = ca4['households-without-driveway'].toLocaleString("en-GB");
            document.getElementById('households-without-driveway-pct-CA4').innerHTML = `${ca4['households-without-driveway-pct']}%`;
        }
        if (ca4['EVI-link']) {
            document.getElementById('EVI-link-CA4').innerHTML = `<a href=${ca4['EVI-link']}>${ca4['EVI-link']}</a>`;
        }
        if (ca4['EVI-email']) {
            document.getElementById('EVI-email-CA4').innerHTML = `<a href=mailto:${ca4['EVI-email']}>${ca4['EVI-email']}</a>`;
        }
        document.getElementById('EVI-portfolio-holder-CA4').innerHTML = ca4['EVI-portfolio-holder'];
        if (ca4['channel-grant-amount']) {
            document.getElementById('channel-grant-amount-CA4').innerHTML = ca4['channel-grant-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('channel-status-CA4').innerHTML = ca4['channel-status'];       
        }
        if ((ca4['channel-status']) && (ca4['channel-grant-amount'])) {
            if (ca4['channel-link']) {
                document.getElementById('channel-link-CA4').innerHTML = `<a href=${ca4['channel-link']}>${ca4['channel-link']}</a>`;
            }
            if (ca4['channel-application-fee'] == null || isNaN(ca4['channel-application-fee'])) {
            document.getElementById('channel-application-fee-CA4').innerHTML = ca4['channel-application-fee']
            } else {
                document.getElementById('channel-application-fee-CA4').innerHTML = ca4['channel-application-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (ca4['channel-installation-fee'] == null || isNaN(ca4['channel-installation-fee'])) {
            document.getElementById('channel-installation-fee-CA4').innerHTML = ca4['channel-installation-fee']
            } else {
                document.getElementById('channel-installation-fee-CA4').innerHTML = ca4['channel-installation-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            if (ca4['channel-annual-fee'] == null || isNaN(ca4['channel-annual-fee'])) {
            document.getElementById('channel-annual-fee-CA4').innerHTML = ca4['channel-annual-fee']
            } else {
                document.getElementById('channel-annual-fee-CA4').innerHTML = ca4['channel-annual-fee'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            }
            document.getElementById('channel-manufacturer-CA4').innerHTML = ca4['channel-manufacturer'];
        }
        if (ca4['LEVI-capital-amount']) {
            document.getElementById('LEVI-capital-amount-CA4').innerHTML = ca4['LEVI-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-tender-stage-CA4').innerHTML = ca4['LEVI-tender-stage'];
            document.getElementById('LEVI-tender-link-CA4').innerHTML = ca4['LEVI-tender-link'];
            document.getElementById('LEVI-tender-open-date-CA4').innerHTML = ca4['LEVI-tender-open-date'];
            document.getElementById('LEVI-tender-close-date-CA4').innerHTML = ca4['LEVI-tender-close-date'];
            document.getElementById('LEVI-CPO(s)-CA4').innerHTML = ca4['LEVI-CPO(s)'];
        }
        if (ca4['LEVI-pilot-capital-amount']) {
            document.getElementById('LEVI-pilot-capital-amount-CA4').innerHTML = ca4['LEVI-pilot-capital-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
            document.getElementById('LEVI-pilot-CPO(s)-CA4').innerHTML = ca4['LEVI-pilot-CPO(s)'];
        }
        document.getElementById('ORCS-total-amount-CA4').innerHTML = ca4['ORCS-total-amount'].toLocaleString("en-GB", {style:"currency", currency:"GBP", maximumFractionDigits:"0"});
        document.getElementById('ORCS-total-charging-devices-CA4').innerHTML = ca4['ORCS-total-charging-devices'].toLocaleString("en-GB");
    }
})
};
