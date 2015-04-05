require 'rails_helper'

RSpec.describe User, type: :model do

  before do
    @user = User.new(name: "Example User", email: "user@example.com",
                     password: "foobar", password_confirmation: "foobar")
  end

  subject { @user }


  describe "Эти поля должны существовать" do


    it { should respond_to(:name) }
    it { should respond_to(:email) }
    it { should respond_to(:password_digest) }
    it { should respond_to(:password) }
    it { should respond_to(:password_confirmation) }
    it { should respond_to(:authenticate) }

  end

  describe "проходит аутентификацию с валидным паролем" do

    before {@user.save}
    let(:found_user) { User.find_by(email: @user.email) }

    it { should eq found_user.authenticate(@user.password) }

  end



end
