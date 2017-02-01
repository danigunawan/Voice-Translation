require 'net/http'
require 'json'

class HomeController < ApplicationController
  def index
    @languages = [['English','en'], ['Filipino','tl'], ['Japanese','ja']]
    @commands = Command.all
    @command = Command.new
  end

  def translate
    @data = {}
    Command.all.each do |command|
      if command.keywords.strip.downcase == params['input'].strip.downcase
        @data = { code: 200, text: [command.response], type: 'command' }
        break
      end
    end

    if @data.blank?
      url = URI("https://translate.yandex.net/api/v1.5/tr.json/translate?")
      @data = JSON.parse(Net::HTTP.post_form(url, {
        'key' => Yandex::API_KEY,
        'text' => params['input'],
        'lang' => params['language']
      }).body)
    end

    render json: @data
  end
end
