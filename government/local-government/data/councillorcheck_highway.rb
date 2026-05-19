require 'json'
require 'csv'
Dir.chdir("..")

# Load JSON data from authorities.json
data = JSON.parse(File.read('data/uk_la_evi.json'))
authorities = data['resources'][0]['data']

require "json"
require "csv"

# Normalizes names, e.g. "Cllr Jane Doe (CON)" => "Jane Doe"
def normalize_portfolio_holder(name)
  return nil unless name && !name.strip.empty?
  name = name.gsub(/^Cllr\s+/, "")            # Remove "Cllr "
  name = name.gsub(/\([^)]+\)/, "")           # Remove "(PARTY)"
  name.strip
end

# 1. Load councillor names by council (downcased for matching)

councillors_by_council = Hash.new { |h, k| h[k] = [] }
CSV.foreach("data/opencouncildata_councillors.csv", headers: true) do |row|
  council = row["Council"].to_s.strip.downcase
  name = row["Councillor Name"].to_s.strip
  councillors_by_council[council] << name.downcase unless name.empty?
#   puts "#{name.downcase}" unless name.empty?
end

# puts "#{councillors_by_council}"

# 2. Load JSON

unmatched = []
highway_authorities = authorities.select{ |a| ["CC","CTY","LBO","MD","SCO","UA","WPA"].include?(a['local-authority-type']) }

highway_authorities.each do |record|
  council = record['nice-name'].to_s.strip
  portfolio_holder = record['EVI-portfolio-holder']
  next unless portfolio_holder && !portfolio_holder.strip.empty?

  norm_holder = normalize_portfolio_holder(portfolio_holder).downcase
#   puts "#{norm_holder}"
  council_key = council.downcase

  # Check if holder appears among councillors for the council
  found = councillors_by_council[council_key].any? { |nm| nm == norm_holder }
#   puts "Found: #{found}"
  unless found
    found_two = councillors_by_council[council_key].any?       # Check if council_key appears among councillors_by_council
    if found_two
        unmatched << { council: council, portfolio_holder: portfolio_holder }
    else
        puts "#{council} has a name mismatch"
    end
  end
end

# 3. Output results
if unmatched.empty?
  puts "All portfolio holders are also listed as councillors in your CSV."
else
  puts "Portfolio holders in JSON not found as councillors for their council:"
  unmatched.each do |entry|
    puts "#{entry[:council]}: #{entry[:portfolio_holder]}"
  end
end