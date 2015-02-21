require 'rails_helper'

describe Role do

  let(:role) { create :role }

  it 'создание одинаковых ролей вызывает ошибку' do
    expect{ create :role, name: role.name }.to raise_error
  end

end
