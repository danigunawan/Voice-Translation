module Yandex
  CONFIG = YAML.load_file("#{::Rails.root}/config/yandex.yml")[::Rails.env]
  API_KEY = CONFIG['api_key']
end
