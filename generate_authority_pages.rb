require 'yaml'

data = YAML.load_file('_data/authorities.yml')
template = File.read('local-government/authority-template.html')

data.each do |authority|
  page = template.gsub('{{ authority.name }}', authority['name'])
                 .gsub('{{ authority.cpc_link }}', authority['cpc_link'])
  File.write("authorities/#{authority['name'].downcase}.html", page)
end