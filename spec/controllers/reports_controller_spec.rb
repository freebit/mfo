require 'rails_helper'

RSpec.describe ReportsController, type: :controller do

  describe "GET #index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #fetch_report" do
    it "returns http success" do
      get :fetch_report
      expect(response).to have_http_status(:success)
    end
  end

end
