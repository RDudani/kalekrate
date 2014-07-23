require 'bundler'
Bundler.require

require 'sinatra/base'
require 'sinatra/assetpack'
require 'sinatra/support'
require 'sinatra/partial'

require_relative 'helpers/init'

Bundler.setup :default
$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../lib', __FILE__)
$: << File.expand_path('../helpers', __FILE__)

require 'dotenv'
Dotenv.load

Recurly.subdomain = ENV['RECURLY_SUBDOMAIN']
Recurly.api_key = ENV['RECURLY_API_KEY']

module KaleKrate
  class App < Sinatra::Base
    register Sinatra::AssetPack
    register Sinatra::Partial
    register Sinatra::HtmlHelpers
    register Sinatra::CountryHelpers

    set :root, './'
    set :environment, ENV['RACK_ENV'] #.to_sym
    set :partial_template_engine, :slim

    configure do
      set :port, 9001
      set :public_folder, './public'
      set :views, Proc.new { File.join(root, 'app', 'views') }
      set :slim, pretty: true
    end

    Sass.load_paths << File.join(root, 'app', 'assets', 'stylesheets')
    assets {
      serve '/css', from: 'public/stylesheets'

      css :application, [
        '/css/base.css',
        '/css/forms.css'
      ]

      css :minimal, [
        '/css/themes/kalekrate/form-base.css',
        '/css/themes/kalekrate/form-minimal.css'
      ]

      css :advanced, [
        '/css/themes/kalekrate/form-base.css',
        '/css/themes/kalekrate/form-advanced.css'
      ]

      serve '/js', from: 'public/javascripts'

      js :minimal_form, [
        '/js/minimal_form.js'
      ]

      js :advanced_form, [
        '/js/minimal_form.js',
        '/js/pricing.js'
      ]

      serve '/images', from: 'public/images'
    }

    get '/minimal' do
      slim :minimal
    end

    get '/advanced' do
      slim :advanced
    end

    post '/api/subscriptions/new' do
      begin
        subscription = Recurly::Subscription.create plan_code: 'kale-fan',
          account: {
            account_code: SecureRandom.uuid,
            first_name: params['first-name'],
            last_name: params['last-name'],
            email: params['email'],
            billing_info: {
              token_id: params['recurly-token']
            }
          }
        redirect '/minimal'
      rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
        puts e
        redirect '/minimal'
      end
    end

    post '/api/accounts/new' do
      begin
        Recurly::Account.create! account_code: SecureRandom.uuid,
          billing_info: { token_id: params['recurly-token'] }
        puts params
        # redirect '/minimal'
      rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
        redirect '/minimal'
      end
    end

    put '/api/accounts/:account_code' do
      begin
        account = Recurly::Account.find params[:account_code]
        account.billing_info = { token_id: params['recurly-token'] }
        account.save!
        redirect '/minimal'
      rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
        redirect '/minimal'
      end
    end

  end
end
