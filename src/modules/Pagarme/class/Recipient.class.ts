import { Address } from "./Address.class"

export class Recipient {
  register_informatin: RegisterInformationPF | RegisterInformationPJ
  bank_account: BankAccount
  transfer_settings: {
    transfer_enabled: true
  }
}

export class RegisterInformationPJ {
  company_name: string
  trading_name: string
  email: string
  document: string
  type: 'corporation'
  annual_revenue: number
  main_address: Address
  phone_numbers: string[]
}

export class RegisterInformationPF {
  name: string
  email: string
  document: string
  type: 'individual'
  birthdate: Date
  monthly_income: number
  professional_occupation: string
  address: Address
  phone_numbers: string[]
}

export class BankAccount {
  holder_name: string
  holder_type: 'individual' | 'company'
  holder_document: string
  bank: string
  branch_number: string
  account_number: string
  account_check_digit: string
  type: "checking" | "savings"
}