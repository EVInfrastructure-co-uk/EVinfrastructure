require 'json'

# Load JSON data from authorities.json
data = JSON.parse(File.read('_data/uk_la_evi.json'))
authorities = data['resources'][0]['data']
england_district_template = File.read('_templates/england-district-template.html')

# # Create _authorities directory if it doesn't exist
# Dir.mkdir('_authorities') unless Dir.exist?('_authorities')

authorities.select { |a| a['local-authority-type'] == 'LBO' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']
  cpc_link = authority['channel-link'].to_s

  filename = "#{slug}.html"

  content = england_district_template.gsub('{{ authority.name }}',name)
                 .gsub('{{ authority.cpc_link }}',cpc_link)

  File.write(filename, content)
  puts "Generated #{filename}"
end
