require 'json'
require 'csv'
Dir.chdir("..")

# Load JSON data from authorities.json
data = JSON.parse(File.read('data/uk_la_evi.json'))
authorities = data['resources'][0]['data']

# Load CSV file properly
csv_file = CSV.read("data/history2016-2026.csv", headers: true)

# Build a hash for faster lookups: { council => { 2025 => row, 2026 => row } }
csv_by_council = {}
csv_file.each do |row|
  council = row["authority"]
  year = row["year"].to_i
  csv_by_council[council] ||= {}
  csv_by_council[council][year] = row
end

# Check for administration changes
csv_by_council.each do |council, years|
  row_2025 = years[2025]
  row_2026 = years[2026]
  
  next unless row_2025 && row_2026 # Skip if either year is missing
  next if row_2025["majority"] == row_2026["majority"] # Skip if no change
  
  authority = authorities.find { |a| a['nice-name'] == council }
  
  if authority
    puts "#{authority['nice-name']} updated from #{authority['current-administration']} to #{row_2026["majority"]}."
    authority['current-administration'] = row_2026["majority"]
    authority['administration-since'] = 2026
    authority['EVI-portfolio-holder'] = "Vacant since 2026 local elections"
  else
    puts "#{council} has a name mismatch"
  end
end

# File.write("data/uk_la_evi.json", JSON.pretty_generate(data))