import { StoreRepository } from '../Store/repository/store.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/modules/User/repository/user.repository';
import parsePhoneNumber from 'libphonenumber-js';
import { Phone } from '../Pagarme/class/Phones.class';
import { Address } from '../Pagarme/class/Address.class';
export interface VerifyCepResponse {
  cep: any;
  logradouro: any;
  bairro: any;
  cidade: any;
  uf: any;
  addressObject: Address;
}

@Injectable()
export class UtilsService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
  ) {}

  async verifyCEP(
    cep: string,
    numero: string,
    complemento?: string,
    costumerId?: string,
  ): Promise<VerifyCepResponse> {
    try {
      const data = (await axios.get(`https://viacep.com.br/ws/${cep}/json/`))
        .data;

      const addressObject = new Address(
        `${numero}, ${data.logradouro}, ${data.bairro}`,
        data.cep,
        data.localidade,
        data.uf,
        'BR',
        complemento,
        costumerId,
      );
      return {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf,
        addressObject,
      };
    } catch {
      throw new HttpException(
        'O cep digitado é inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyCNPJ(cnpj: string): Promise<string> {
    try {
      const data = (
        await axios.get(
          `https://api.cpfcnpj.com.br/5ae973d7a997af13f0aaf2bf60e65803/4/${cnpj}`,
        )
      ).data;
      return data.cnpj;
    } catch {
      throw new HttpException('O cnpj é inválido', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyCPF(cpf: number | string): Promise<string> {
    try {
      const data = (
        await axios.get(
          `https://api.cpfcnpj.com.br/5ae973d7a997af13f0aaf2bf60e65803/1/${cpf}`,
        )
      ).data;
      return data.cpf;
    } catch {
      throw new HttpException('O cpf é inválido', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyIsMaiorDeIdade(dataNascimento: Date) {
    const todaysDate = new Date();
    const birthDate = new Date(dataNascimento);
    const idade = (todaysDate.getTime() - birthDate.getTime()) / 31536000000;

    if (idade < 18) {
      throw new HttpException(
        'É necessário ter pelo menos 18 anos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPhoneNumber(incomingPhone: string) {
    const parsedPhoneNumber = parsePhoneNumber(incomingPhone);

    const phoneNumber = parsedPhoneNumber.formatInternational();

    if (!parsedPhoneNumber.isValid()) {
      throw new HttpException(
        'O numero de telefone fornecido não é válido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const phoneArray = phoneNumber.split(' ');

    const phoneObject = new Phone(
      parsedPhoneNumber.countryCallingCode,
      phoneArray[1],
      phoneArray[2] + phoneArray[3],
    );

    return {
      phoneNumber,
      phoneObject,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }

  async passwordIsCorrect(hashPassword: string, password: string) {
    const passwordIsCorrect = await bcrypt.compare(password, hashPassword);

    if (!passwordIsCorrect) {
      throw new HttpException(
        'A senha digitada está incorreta',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
