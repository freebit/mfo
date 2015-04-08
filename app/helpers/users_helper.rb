module UsersHelper


  def fetch_agent_data( user )

    response = Savon_client::CLIENT.call(:get_tarifs)



      @tarifs = response.body[:get_tarifs_response][:return][:Тариф]


      @tarifs.each do |tarif|

        t = Tarif.find_or_create_by(type_t:tarif[:ТипТарифа], platform:tarif[:Площадка])

        t.update  type_t:    tarif[:ТипТарифа],
                  platform:  tarif[:Площадка],
                  rate:      tarif[:Ставка],
                  dop_rate:  tarif[:СтавкаДополнительная],
                  minimum:   tarif[:Минималка]

      end



    #binding.pry

  end

end

