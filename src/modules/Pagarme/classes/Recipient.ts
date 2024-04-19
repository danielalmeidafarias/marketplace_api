export interface IRecipientConstructorParameters {
  register_information: RegisterInformationPF | RegisterInformationPJ;
  default_bank_account: BankAccount;
  recipient_id?: string;
}

export class Recipient {
  constructor({
    register_information,
    recipient_id,
  }: Partial<IRecipientConstructorParameters>);
  constructor({
    default_bank_account,
    register_information,
    recipient_id,
  }: IRecipientConstructorParameters) {
    this.register_information = register_information;

    if (default_bank_account) {
      this.default_bank_account = default_bank_account;
    }
    if (recipient_id) {
      this.recipient_id = recipient_id;
    }
  }

  register_information: RegisterInformationPF | RegisterInformationPJ;

  default_bank_account: BankAccount;

  recipient_id?: string;
}

export interface IRegisterInformationPJConstructorParameters {
  company_name: string;
  trading_name: string;
  email: string;
  document: string;
  annual_revenue: number;
  main_address: RecipientAddress;
  phone_numbers: RecipientPhone[];
  managing_partners: ManagingPartner[];
}

export class RegisterInformationPJ {
  constructor({
    company_name,
    trading_name,
    email,
    document,
    annual_revenue,
    main_address,
    phone_numbers,
    managing_partners,
  }: IRegisterInformationPJConstructorParameters) {
    this.company_name = company_name;
    this.trading_name = trading_name;
    this.email = email;
    this.document = document;
    this.annual_revenue = annual_revenue;
    this.main_address = main_address;
    this.phone_numbers = phone_numbers;
    this.managing_partners = managing_partners;
  }
  company_name: string;
  trading_name: string;
  email: string;
  document: string;
  readonly type = 'corporation';
  annual_revenue: number;
  main_address: RecipientAddress;
  phone_numbers: RecipientPhone[];
  managing_partners: ManagingPartner[];
}

export interface IRegisterInformationPFConstructorParameters {
  name: string;
  email: string;
  document: string;
  birthdate: string;
  monthly_income: number;
  professional_occupation: string;
  address: RecipientAddress;
  phone_numbers: RecipientPhone[];
}

export class RegisterInformationPF {
  constructor({
    name,
    email,
    document,
    birthdate,
    monthly_income,
    professional_occupation,
    address,
    phone_numbers,
  }: IRegisterInformationPFConstructorParameters) {
    this.name = name;
    this.email = email;
    this.document = document;
    this.birthdate = birthdate;
    this.monthly_income = monthly_income;
    this.professional_occupation = professional_occupation;
    this.address = address;
    this.phone_numbers = phone_numbers;
  }
  name: string;
  email: string;
  document: string;
  readonly type = 'individual';
  birthdate: string;
  monthly_income: number;
  professional_occupation: string;
  address: RecipientAddress;
  phone_numbers: RecipientPhone[];
}

export interface IRecipientAddressConstructorParameters {
  street: string;
  complementary: string;
  street_number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  reference_point: string;
}

export class RecipientAddress {
  constructor({
    street,
    complementary,
    street_number,
    neighborhood,
    city,
    state,
    zip_code,
    reference_point,
  }: IRecipientAddressConstructorParameters) {
    this.street = street;
    this.complementary = complementary;
    this.street_number = street_number;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.zip_code = zip_code;
    this.reference_point = reference_point;
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

export interface IRecipientPhoneConstructorParameters {
  ddd: string;
  number: string;
  type: 'mobile' | 'home';
}

export class RecipientPhone {
  constructor({ ddd, number, type }: IRecipientPhoneConstructorParameters) {
    this.ddd = ddd;
    this.number = number;
    this.type = type;
  }
  ddd: string;
  number: string;
  type: 'mobile' | 'home';
}

export interface IManagingPartnerContructorParameters {
  name: string;
  email: string;
  document: string;
  birthdate: Date;
  monthly_income: number;
  professional_occupation: string;
  address: RecipientAddress;
  phone_numbers: RecipientPhone[];
  self_declared_legal_representative: boolean;
}

export class ManagingPartner {
  constructor({
    name,
    email,
    document,
    birthdate,
    monthly_income,
    professional_occupation,
    address,
    phone_numbers,
    self_declared_legal_representative,
  }: IManagingPartnerContructorParameters) {
    this.name = name;
    this.email = email;
    this.document = document;
    this.birthdate = birthdate;
    this.monthly_income = monthly_income;
    this.professional_occupation = professional_occupation;
    this.address = address;
    this.phone_numbers = phone_numbers;
    this.self_declared_legal_representative =
      self_declared_legal_representative;
  }
  name: string;
  email: string;
  document: string;
  readonly type = 'individual';
  birthdate: Date;
  monthly_income: number;
  professional_occupation: string;
  address: RecipientAddress;
  phone_numbers: RecipientPhone[];
  self_declared_legal_representative: boolean;
}

export interface IBankAccountConstructorParameters {
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

export class BankAccount {
  constructor({
    holder_document,
    holder_name,
    account_number,
    account_check_digit,
    bank,
    branch_check_digit,
    branch_number,
    holder_type,
    type,
  }: IBankAccountConstructorParameters) {
    this.holder_name = holder_name;
    this.holder_document = holder_document;
    this.account_number = account_number;
    this.account_check_digit = account_check_digit;
    this.bank = bank;
    this.branch_check_digit = branch_check_digit;
    this.branch_number = branch_number;
    this.holder_type = holder_type;
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
