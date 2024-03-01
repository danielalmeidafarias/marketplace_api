export class Phones {
  constructor(mobile_phone?: Phone, home_phone?: Phone) {
    this.mobile_phone = mobile_phone;
    this.home_phone = home_phone;
  }

  mobile_phone: Phone;
  home_phone: Phone;
}

export class Phone {
  constructor(country_code: string, area_code: string, number: string) {
    this.country_code = country_code
    this.area_code = area_code
    this.number = number
  }
  country_code: string;
  area_code: string;
  number: string;
}
