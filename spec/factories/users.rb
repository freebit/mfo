FactoryGirl.define do
  factory :user do
    name "Testus"
    email "test@mail.ru"
    password "test"
    password_confirmation "test"
    last_visit "2015-02-23 10:29:38"
    active false
  end

end
