FactoryGirl.define do
  factory :user do
    name "Testus"
    email "test@mail.ru"
    password "testus"
    password_confirmation "testus"
    last_visit "2015-02-23 10:29:38"
    active true
  end

end
