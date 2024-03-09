export class IRecipient {
  register_information: IRegisterInformationPF | IRegisterInformationPJ;
  default_bank_account: IBankAccount;
  // transfer_settings: {
  //   transfer_enabled: true;
  // };
  // automatic_anticipation_settings: {
  //   enabled: true,
  // }
}

export interface IRegisterInformationPJ {
  company_name: string;
  trading_name: string;
  email: string;
  document: string;
  type: 'corporation';
  annual_revenue: number;
  main_address: IRecipientAddress;
  phone_numbers: IRecipientPhone[]
  managing_partners: IManagingPartners[]
}

export interface IRegisterInformationPF {
  name: string;
  email: string;
  document: string;
  type: 'individual';
  birthdate: string;
  monthly_income: number;
  professional_occupation: string;
  address: IRecipientAddress;
  phone_numbers: IRecipientPhone[];
}

export interface IRecipientAddress {
  street: string
  complementary: string
  street_number: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  reference_point : string
}

export interface IRecipientPhone {
  ddd: string;
  number: string;
  type: 'mobile' | 'home';
}

export interface IManagingPartners {
  name: string;
  email: string;
  document: string;
  type: 'individual';
  birthdate: Date;
  monthly_income: number;
  professional_occupation: string;
  address: IRecipientAddress;
  phone_numbers: IRecipientPhone[];
  self_declared_legal_representative: boolean
}

export interface IBankAccount {
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
