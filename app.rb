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

    set :root, File.dirname(__FILE__)
    set :environment, ENV['RACK_ENV'].to_sym
    set :partial_template_engine, :slim

    configure do
      set :port, 9001
      set :public_folder, './public'
      set :views, Proc.new { File.join(root, 'app', 'views') }
      set :slim, pretty: true
    end

    Sass.load_paths << File.join(root, 'app', 'assets', 'stylesheets')
    assets {

      serve '/css', from: 'app/assets/stylesheets'

      css :application, '/application.css', [
        '/css/base.css',
        '/css/forms.css'
      ]

      css :minimal, '/minimal.css', [
        '/css/themes/kalekrate/form-base.css',
        '/css/themes/kalekrate/form-minimal.css'
      ]

      css :minimal_full, '/minimal_full.css', [
        '/css/themes/kalekrate/form-base.css',
        '/css/themes/kalekrate/form-minimal-full.css'
      ]

      css :advanced, '/advanced.css', [
        '/css/themes/kalekrate/form-base.css',
        '/css/themes/kalekrate/form-minimal.css',
        '/css/themes/kalekrate/form-advanced.css'
      ]

      serve '/js', from: 'app/assets/javascripts'

      js :minimal_form, '/minimal_form.js', [
        '/js/minimal_form.js'
      ]

      js :advanced_form, '/advanced_form.js', [
        '/js/minimal_form.js',
        '/js/addons.js',
        '/js/pricing.js',
        '/js/handlebars-latest.js'
      ]

      js :amazon_form, '/amazon_form.js', [
        '/js/minimal_form.js',
        '/js/amazon_form.js',
        '/js/addons.js',
        '/js/pricing.js',
        '/js/handlebars-latest.js'
      ]

      serve '/images', from: 'app/assets/images'
    }

    get '/minimal' do
      slim :minimal
    end

    get '/minimal-full' do
      slim :minimal_full
    end

    get '/advanced' do
      slim :advanced
    end

    get '/one-time' do
      slim :one_time
    end

    get '/advanced-v2' do
      slim :advanced_v2
    end

    get '/amazon' do
      slim :amazon
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

    post '/api/transactions' do
      begin
        Recurly::Account.create! account_code: SecureRandom.uuid,
          billing_info: { token_id: params['recurly-token'] }
        puts params
        # redirect '/minimal'
      rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
        redirect '/one-time'
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
