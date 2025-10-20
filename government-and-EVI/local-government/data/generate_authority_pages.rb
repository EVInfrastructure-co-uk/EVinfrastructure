require 'json'
Dir.chdir("..")

# Load JSON data from authorities.json
data = JSON.parse(File.read('data/uk_la_evi.json'))
authorities = data['resources'][0]['data']

england_ca = File.read('_templates/england-CA.html')

england_district = File.read('_templates/england-district.html')
england_district_ca = File.read('_templates/england-district-CA.html')
england_district_2ca = File.read('_templates/england-district-2CA.html')
england_district_3ca = File.read('_templates/england-district-3CA.html')
england_district_extra_ca = File.read('_templates/england-district-extra-CA.html')

england_county = File.read('_templates/england-county.html')
england_county_ca = File.read('_templates/england-county-CA.html')
england_county_2ca = File.read('_templates/england-county-2CA.html')
england_county_3ca = File.read('_templates/england-county-3CA.html')
england_county_extra_ca = File.read('_templates/england-county-extra-CA.html')

england_unitary = File.read('_templates/england-unitary.html')
england_unitary_ca = File.read('_templates/england-unitary-CA.html')
england_unitary_2ca = File.read('_templates/england-unitary-2CA.html')
england_unitary_3ca = File.read('_templates/england-unitary-3CA.html')
england_unitary_extra_ca = File.read('_templates/england-unitary-extra-CA.html')
england_unitary_extra_2ca = File.read('_templates/england-unitary-extra-2CA.html')

ni = File.read('_templates/ni.html')

scotland_ca = File.read('_templates/scotland-CA.html')
scotland_unitary_ca = File.read('_templates/scotland-unitary-CA.html')
scotland_unitary = File.read('_templates/scotland-unitary.html')
wales_ca = File.read('_templates/wales-CA.html')

wales_unitary_ca = File.read('_templates/wales-unitary-CA.html')
wales_unitary = File.read('_templates/wales-unitary.html')

# # Create _authorities directory if it doesn't exist
# Dir.mkdir('_authorities') unless Dir.exist?('_authorities')

authorities.select { |a| a['local-authority-type'] == 'CC' or a['local-authority-type'] == 'LBO' or a['local-authority-type'] == 'MD' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  if authority['combined-authority-2'].blank? {
    content = england_unitary_ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  } elsif authority['combined-authority-3'].blank? {
    content = england_unitary_2ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  } else {
    content = england_unitary_3ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  }
  File.write(filename, content)    
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-code'] == 'HCK'}.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = england_unitary.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'COMB' and a['region'] != 'Wales' and a['region'] != 'Scotland' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = england_ca.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'UA' and a['combined-authority'] == '' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  if authority['combined-authority-2'].blank?
    content = england_unitary.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  elsif authority['combined-authority-3'].blank?
    content = england_unitary_extra_ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  else
    content = england_unitary_extra_2ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  end
  File.write(filename, content)    
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'UA' and a['combined-authority'] != '' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  if authority['combined-authority-2'].blank?
    content = england_unitary_ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  elsif authority['combined-authority-3'].blank?
    content = england_unitary_2ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  else
    content = england_unitary_3ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug) 
  end
  File.write(filename, content)    
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'CTY' and a['combined-authority'] == '' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  if authority['combined-authority-2'].blank?
    content = england_county.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  elsif authority['combined-authority-3'].blank?
    content = england_county_extra_ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  end
  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'CTY' and a['combined-authority'] != '' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  if authority['combined-authority-2'].blank?
    content = england_county_ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  elsif authority['combined-authority-3'].blank? 
    content = england_county_2ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  else
    content = england_county_3ca.gsub('{{ authority.name }}',name)
                                .gsub('{{ authority.slug }}',slug)
  end
  File.write(filename, content)    
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'NMD'}.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']
  county_la_code = authority['county-la']
  filename = "#{slug}.html"

  authorities.select { |b| b['local-authority-code'] == county_la_code}.each do |county_la|
    county_la_ca =  county_la['combined-authority']
      if county_la_ca.blank?
        if authority['combined-authority-2'].blank?
          content = england_district.gsub('{{ authority.name }}',name)
                                      .gsub('{{ authority.slug }}',slug)
        elsif authority['combined-authority-3'].blank?
          content = england_district_extra_ca.gsub('{{ authority.name }}',name)
                                      .gsub('{{ authority.slug }}',slug)
        end
      else
        if authority['combined-authority-2'].blank?
          content = england_district_ca.gsub('{{ authority.name }}',name)
                                      .gsub('{{ authority.slug }}',slug)
        elsif authority['combined-authority-3'].blank?
          content = england_district_2ca.gsub('{{ authority.name }}',name)
                                      .gsub('{{ authority.slug }}',slug)
        else
          content = england_district_3ca.gsub('{{ authority.name }}',name)
                                      .gsub('{{ authority.slug }}',slug)
        end
      end
      File.write(filename, content)
      puts "Generated #{filename}"
  end

end

authorities.select { |a| a['local-authority-type'] == 'NID' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = ni.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'SCO' and a['combined-authority'] != '' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = scotland_unitary_ca.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'SCO' and a['combined-authority'] == '' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = scotland_unitary.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'COMB' and a['region'] == 'Scotland' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = scotland_ca.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'COMB' and a['region'] == 'Wales' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = wales_ca.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'WPA' and a['combined-authority'] == '' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = wales_unitary.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end

authorities.select { |a| a['local-authority-type'] == 'WPA' and a['combined-authority'] != '' }.each do |authority|
  name = authority['nice-name']
  slug = authority['gov-uk-slug']

  filename = "#{slug}.html"

  content = wales_unitary_ca.gsub('{{ authority.name }}',name)
                              .gsub('{{ authority.slug }}',slug)

  File.write(filename, content)
  puts "Generated #{filename}"
end
