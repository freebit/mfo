# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# создаем роли


Role.create(name: :admin, title:'Агент')
Role.create(name: :client, title:'Клиент')

# Platform.create(name:"Сбербанк-АСТ",number:"1")
# Platform.create(name:"Росселторг",number:"2")
# Platform.create(name:"ММВБ",number:"3")


