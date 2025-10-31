require 'json'
require 'csv'
Dir.chdir("..")

# Load JSON data from authorities.json
data = JSON.parse(File.read('data/uk_la_evi.json'))
authorities = data['resources'][0]['data']
csv_file_path = 'data/data.csv'

matches = 0
not_matches = 0

# Open the CSV file and iterate through each row
CSV.foreach(csv_file_path) do |row|
  exact_match = 0

  # Access data in each row using headers
  la = row[0]
  data1 = row[1]
  data2 = row[2]

    authorities.each do |entry|
        if "City of "+entry['nice-name'] == la or entry['nice-name'] == la
        then entry['field1'] = data1
        entry['field2'] = data2
        matches = matches + 1
        exact_match = 1
        end
    end
 
    if exact_match ==0
        puts "#{la} is not an exact match"
        not_matches = not_matches + 1
    end
end

File.write("data/uk_la_evi.json", JSON.pretty_generate(data))
puts "data added for #{matches} authorities, with #{not_matches} without match"