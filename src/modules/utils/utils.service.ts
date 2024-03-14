import { StoreRepository } from '../Store/repository/store.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/modules/User/repository/user.repository';
import parsePhoneNumber from 'libphonenumber-js';
import {
  ICostumerAddress,
  ICostumerPhone,
} from '../Pagarme/interfaces/Costumer.interface';
import {
  IRecipientAddress,
  IRecipientPhone,
} from '../Pagarme/interfaces/Recipient.interface';
import { UUID } from 'crypto';
@Injectable()
export class UtilsService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
  ) {}

  async verifyExistingAccount(accountId: UUID) {
    try {
      const account =
        await this.userRepository.verifyExistingUserById(accountId);
      return { id: account.id };
    } catch {
      try {
        const account =
          await this.storeRepository.verifyExistingStoreById(accountId);
        return { id: account.id };
      } catch (err) {
        console.error(err);
        throw new HttpException(
          'Não foi encontrad nenhuma conta com o id fornecido',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async verifyCEP(
    cep: string,
    numero: string,
    complemento?: string,
    costumerId?: string,
  ) {
    try {
      const data = (await axios.get(`https://viacep.com.br/ws/${cep}/json/`))
        .data;

      return {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf,
      };
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'O cep digitado é inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async transformCostumerAddress(
    cep: string,
    numero: string,
    complemento: string,
  ) {
    try {
      const data = (await axios.get(`https://viacep.com.br/ws/${cep}/json/`))
        .data;

      const addressObject: ICostumerAddress = {
        line_1: `${numero}, ${data.logradouro}, ${data.bairro}`,
        line_2: complemento,
        city: data.localidade,
        zip_code: data.cep,
        state: data.uf,
        country: 'BR',
      };

      return addressObject;
    } catch (err) {
      console.error(err);
    }
  }

  async transformRecipientAddress(
    cep: string,
    numero: string,
    complemento: string,
    ponto_referencia: string,
  ) {
    try {
      const data = (await axios.get(`https://viacep.com.br/ws/${cep}/json/`))
        .data;

      const addressObject: IRecipientAddress = {
        street: data.logradouro,
        street_number: numero,
        neighborhood: data.bairro,
        complementary: complemento,
        reference_point: ponto_referencia,
        city: data.localidade,
        zip_code: data.cep,
        state: data.uf,
      };

      return addressObject;
    } catch (err) {
      console.error(err);
    }
  }

  async verifyCNPJ(cnpj: string): Promise<string> {
    try {
      await axios.get(
        `https://api.cpfcnpj.com.br/5ae973d7a997af13f0aaf2bf60e65803/4/${cnpj}`,
      );
      return cnpj;
    } catch {
      throw new HttpException('O cnpj é inválido', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyCPF(cpf: string): Promise<string> {
    try {
      await axios.get(
        `https://api.cpfcnpj.com.br/5ae973d7a997af13f0aaf2bf60e65803/1/${cpf}`,
      );
      return cpf;
    } catch {
      throw new HttpException('O cpf é inválido', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyIsMaiorDeIdade(birthdate: Date) {
    const todaysDate = new Date();
    const birthDate = new Date(birthdate);
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

    return phoneNumber;
  }

  async transformCostumerPhone(incomingPhone: string) {
    const parsedPhoneNumber = parsePhoneNumber(incomingPhone);

    const phoneNumber = parsedPhoneNumber.formatInternational();

    const phoneArray = phoneNumber.split(' ');

    const phoneObject: ICostumerPhone = {
      country_code: parsedPhoneNumber.countryCallingCode,
      area_code: phoneArray[1],
      number: phoneArray[2] + phoneArray[3],
    };

    return phoneObject;
  }

  async transformRecipientPhone(mobile_phone: string, home_phone?: string) {
    if (home_phone) {
      const parsedMobilePhoneNumber = parsePhoneNumber(mobile_phone);
      const mobilePhoneNumber = parsedMobilePhoneNumber.formatInternational();
      const mobilePhoneArray = mobilePhoneNumber.split(' ');

      const mobilePhoneObject: IRecipientPhone = {
        ddd: mobilePhoneArray[1],
        number: mobilePhoneArray[2] + mobilePhoneArray[3],
        type: 'mobile',
      };

      const parsedHomePhoneNumber = parsePhoneNumber(home_phone);
      const homePhoneNumber = parsedHomePhoneNumber.formatInternational();
      const homePhoneArray = homePhoneNumber.split(' ');

      const homePhoneObject: IRecipientPhone | null = {
        ddd: homePhoneArray[1],
        number: homePhoneArray[2] + homePhoneArray[3],
        type: 'home',
      };

      return homePhoneObject
        ? [mobilePhoneObject, homePhoneObject]
        : [mobilePhoneObject];
    } else {
      const parsedMobilePhoneNumber = parsePhoneNumber(mobile_phone);
      const mobilePhoneNumber = parsedMobilePhoneNumber.formatInternational();
      const mobilePhoneArray = mobilePhoneNumber.split(' ');

      const mobilePhoneObject: IRecipientPhone = {
        ddd: mobilePhoneArray[1],
        number: mobilePhoneArray[2] + mobilePhoneArray[3],
        type: 'mobile',
      };

      return [mobilePhoneObject];
    }
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

  // async transformUserRecipientBirthdate(incomingBirthdate: Date) {

  //   const day = incomingBirthdate.getDay()

  //   const month = inc

  // }
}
