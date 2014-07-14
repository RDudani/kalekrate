require 'bundler'
Bundler.require

require 'sinatra/base'
require 'sinatra/assetpack'

Bundler.setup :default
$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../lib', __FILE__)

require 'dotenv'
Dotenv.load

Recurly.subdomain = ENV['RECURLY_SUBDOMAIN']
Recurly.api_key = ENV['RECURLY_API_KEY']

module KaleKrate
  class App < Sinatra::Base
    set :root, File.dirname(__FILE__)
    set :environment, ENV['RACK_ENV'].to_sym
    register Sinatra::AssetPack

    assets {
      serve '/css', from: 'app/assets/stylesheets'

      css :application, '/css/application.css', [
        '/css/base.css',
        '/css/forms.css',
        '/css/themes/**/*'
      ]

      serve '/images', from: 'app/assets/images'
    }

    Sass.load_paths << File.join(root, 'app', 'assets', 'stylesheets')

    configure do
      set :port, 9001
      set :public_folder, './public'
      set :views, Proc.new { File.join(root, 'app', 'views') }
      set :slim, pretty: true
    end

    get '/minimal' do
      slim :minimal
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
        redirect 'http://localhost:9292/minimal'
      rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
        puts e
        redirect 'http://localhost:9292/minimal'
      end
    end

    post '/api/accounts/new' do
      begin
        Recurly::Account.create! account_code: SecureRandom.uuid,
          billing_info: { token_id: params['recurly-token'] }
        puts params
        # redirect 'http://localhost:9292/minimal'
      rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
        redirect 'http://localhost:9292/minimal'
      end
    end

    put '/api/accounts/:account_code' do
      begin
        account = Recurly::Account.find params[:account_code]
        account.billing_info = { token_id: params['recurly-token'] }
        account.save!
        redirect 'http://localhost:9292/minimal'
      rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
        redirect 'http://localhost:9292/minimal'
      end
    end

  end
end
