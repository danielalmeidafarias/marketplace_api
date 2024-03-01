export class Address {
  constructor(
    line_1: string,
    zip_code: string,
    city: string,
    state: string,
    country: string,
    line_2?: string,
    costumer_id?: string,
    address_id?: string,
  ) {

    this.line_1 = line_1
    this.zip_code = zip_code
    this.city = city
    this.state = state
    this.country = country

    if(line_2) {
      this.line_2 = line_2
    }

    if(costumer_id) {
      this.costumer_id = costumer_id
    }

    if(address_id) {
      this.address_id = address_id
    }

  }
  
  address_id: string
  line_1: string
  line_2: string
  zip_code: string
  city: string
  state: string
  country: string
  costumer_id: string
}