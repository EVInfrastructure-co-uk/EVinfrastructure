require 'yaml'

data = YAML.load_file('_data/authorities.yaml')
template = File.read('government-and-EVI/local-government/_templates/england-district-template.html')

data.each do |authority|
  page = template.gsub('{{ authority.name }}', authority['name'])
                 .gsub('{{ authority.cpc_link }}', authority['cpc_link'])
  File.write("government-and-EVI/local-government/#{authority['gov-uk-slug']}.html", page)
end
