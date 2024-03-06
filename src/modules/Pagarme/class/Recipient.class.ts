import { Address } from './Address.class';
import { Phone } from './Phones.class';

export class Recipient {
  constructor(
    register_information: RegisterInformationPF | RegisterInformationPJ,
    default_bank_account: BankAccount,
  ) {
    this.default_bank_account = default_bank_account;
    this.register_information = register_information;
  }
  register_information: RegisterInformationPF | RegisterInformationPJ;
  default_bank_account: BankAccount;
  transfer_settings: {
    transfer_enabled: true;
  };
  automatic_anticipation_settings: {
    enabled: true,
  }
}

export class RegisterInformationPJ {
  constructor(

    company_name: string,
    trading_name: string,
    email: string,
    document: string,
    annual_revenue: number,
    main_address: RegisterInformationAddress,
    phones: RegisterInformationPhone[]


  ) {
    this.company_name = company_name
    this.trading_name = trading_name
    this.email = email
    this.document = document
    this.annual_revenue = annual_revenue
    this.main_address = main_address
    this.phone_numbers = phones
  }
  company_name: string;
  trading_name: string;
  email: string;
  document: string;
  type = 'corporation';
  annual_revenue: number;
  main_address: RegisterInformationAddress;
  phone_numbers: RegisterInformationPhone[]
  ;
}

export class RegisterInformationPF {
  constructor(
    name: string,
    email: string,
    document: string,
    birthdate: string,
    monthly_income: number,
    professional_occupation: string,
    address: RegisterInformationAddress,
    phones: RegisterInformationPhone[]
  ) {
    this.name = name;
    this.email = email;
    this.document = document;
    this.birthdate = birthdate;
    this.monthly_income = monthly_income;
    this.professional_occupation = professional_occupation;
    this.address = address;
    this.phone_numbers = phones
  }
  name: string;
  email: string;
  document: string;
  type = 'individual';
  birthdate: string;
  monthly_income: number;
  professional_occupation: string;
  address: RegisterInformationAddress;
  phone_numbers: RegisterInformationPhone[];
}

export class RegisterInformationAddress {
  constructor(
    street: string,
    complementary: string,
    street_number: string,
    neighborhood: string,
    city: string,
    state: string,
    zip_code: string,
    reference_point: string,
  ) {
    (this.street = street),
      (this.complementary = complementary),
      (this.street_number = street_number),
      (this.neighborhood = neighborhood),
      (this.city = city),
      (this.state = state),
      (this.zip_code = zip_code),
      (this.reference_point = reference_point);
  }
  street: string;
  complementary: string;
  street_number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  reference_point: string;
}

export class RegisterInformationPhone {
  constructor(ddd: string, number: string, type: string) {
    this.ddd = ddd;
    this.number = number;
    this.type = type;
  }
  ddd: string;
  number: string;
  type: string;
}

export class ManagingPartners {
  name: string;
  email: string;
  document: string;
  type = 'individual';
  birthdate: string;
  monthly_income: number;
  professional_occupation: string;
  address: RegisterInformationAddress;
}

export class BankAccount {
  constructor(
    holder_name: string,
    holder_type: 'individual' | 'company',
    holder_document: string,
    bank: string,
    branch_number: string,
    branch_check_digit: string,
    account_number: string,
    account_check_digit: string,
    type: 'checking' | 'savings',
  ) {
    this.holder_document = holder_document;
    this.holder_name = holder_name;
    this.holder_type = holder_type;
    this.bank = bank;
    this.branch_check_digit = branch_check_digit;
    this.branch_number = branch_number;
    this.account_check_digit = account_check_digit;
    this.account_number = account_number;
    this.type = type;
  }
  holder_name: string;
  holder_type: 'individual' | 'company';
  holder_document: string;
  bank: string;
  branch_number: string;
  branch_check_digit: string;
  account_number: string;
  account_check_digit: string;
  type: 'checking' | 'savings';
}
