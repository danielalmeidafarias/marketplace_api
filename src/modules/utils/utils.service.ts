import { StoreRepository } from '../Store/repository/store.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { phone } from 'phone';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/modules/User/repository/user.repository';
export interface VerifyCepResponse {
  cep: any;
  logradouro: any;
  bairro: any;
  cidade: any;
  uf: any;
}

@Injectable()
export class UtilsService {
  constructor(
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
  ) {}

  async verifyCEP(cep: string): Promise<VerifyCepResponse> {
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

  async verifyPhoneNumber(phoneNumber: string) {
    const validPhone = phone(phoneNumber, { country: 'BR' });

    if (!validPhone.isValid) {
      throw new HttpException(
        'O numero de telefone fornecido não é válido',
        HttpStatus.BAD_REQUEST,
      );
    }

    return validPhone.phoneNumber;
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
