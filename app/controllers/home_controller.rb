require 'net/http'
require 'json'

class HomeController < ApplicationController
  before_action :set_api_key, except: :index

  def index
    @languages = [['English','en'], ['Tagalog','tl'], ['Japanese','ja']]
    @recognitions = [['English','en-US'], ['Filipino','fil-PH'], ['Japanese','ja']]
    @commands = Command.all
    @command = Command.new
  end
  #
  # def detect_language
  #   url = URI("https://translate.yandex.net/api/v1.5/tr.json/detect?")
  #   data = JSON.parse(Net::HTTP.post_form(url, {
  #     'key' => @api_key,
  #     'text' => input,
  #   }).body)
  #   render json: data
  # end

  def translate
    if command = Command.where(keywords: params['input'], language: params['language']).first
      data = { code: 200, text: [command.response], lang: params['language'] }
    else
      url = URI("https://translate.yandex.net/api/v1.5/tr.json/translate?")
      data = JSON.parse(Net::HTTP.post_form(url, {
  			'key' => @api_key,
        'text' => params['input'],
        'lang' => params['language']
      }).body)
    end
    render json: data
  end

  private

  def set_api_key
    @api_key = "trnsl.1.1.20170124T023923Z.db368f9b9c7a7f06.26bd8be0cf53946d203c786ae83d24c73ea5954d"
  end
end
