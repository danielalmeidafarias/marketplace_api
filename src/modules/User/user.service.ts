import { UserRepository } from './repository/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import {
  UtilsService,
  VerifyCepResponse,
} from 'src/modules/utils/utils.service';
import { StoreRepository } from '../Store/repository/store.repository';
import { ProductRepository } from '../Product/repository/product.repository';
import { PagarmeModule } from '../Pagarme/pagarme.module';
import { PagarmeService } from '../Pagarme/pagarme.service';
import { Phones } from '../Pagarme/class/Phones.class';

export interface ICreateUser {
  email: string;
  password: string;
  incomingCep: string;
  numero: string;
  complemento: string;
  incomingCpf: string;
  dataNascimento: Date;
  name: string;
  lastName: string;
  incomingMobilePhone: string;
  incomingHomePhone: string;
}

export interface IUpdateUser {
  access_token: string;
  refresh_token: string;
  password: string;
  newPassword: string;
  newEmail: string;
  newCEP: string;
  newNumero: string;
  newComplemento: string;
  newName: string;
  newLastName: string;
  newPhone: string;
}

export interface IDeleteUser {
  access_token: string;
  refresh_token: string;
  password: string;
}

export interface IGetUserInfo {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private utilsService: UtilsService,
    private storeRepository: StoreRepository,
    private productRepository: ProductRepository,
    private pagarmeService: PagarmeService,
  ) {}

  async createUser({
    email,
    password,
    incomingCep,
    numero,
    complemento,
    incomingCpf,
    dataNascimento,
    name,
    lastName,
    incomingMobilePhone,
    incomingHomePhone,
  }: ICreateUser) {
    await this.utilsService.verifyIsMaiorDeIdade(dataNascimento);

    const cpf = await this.utilsService.verifyCPF(incomingCpf);

    const phone =
      await this.utilsService.verifyPhoneNumber(incomingMobilePhone);

    const { cep, logradouro, bairro, cidade, uf, addressObject } =
      await this.utilsService.verifyCEP(incomingCep, numero, complemento);

      const hashedPassword = await this.utilsService.hashPassword(password);

    await this.storeRepository.verifyThereIsNoStoreWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithCPF(cpf);

    await this.storeRepository.verifyThereIsNoStoreWithPhone(phone.phoneNumber);

    await this.userRepository.verifyThereIsNoUserWithPhone(phone.phoneNumber);

    const user = new User(
      email,
      hashedPassword,
      name.toUpperCase(),
      lastName.toUpperCase(),
      dataNascimento,
      cpf,
      cep,
      numero,
      complemento,
      logradouro,
      bairro,
      cidade,
      uf,
      phone.phoneNumber,
    );

    const costumerId = await this.pagarmeService.createCostumer(
      user,
      {
        mobile_phone: phone.phoneObject,
        home_phone: null,
      },
      addressObject,
    );

    await this.userRepository.createUser(user, costumerId);

    const { access_token, refresh_token } = await this.authService.signIn(user);

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async loginUser({ email, password }: LoginUserDTO) {
    const user = await this.userRepository.verifyExistingUserByEmail(email);

    await this.utilsService.passwordIsCorrect(user.password, password);

    const { access_token, refresh_token } = await this.authService.signIn(user);

    return {
      access_token,
      refresh_token,
    };
  }

  async getUser({ access_token }: IGetUserInfo) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    await this.authService.verifyTokenId(access_token, user.id);

    return {
      user: await this.userRepository.getUserInfo(id),
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async updateUser({
    access_token,
    password,
    newPassword,
    newEmail,
    newCEP,
    newNumero,
    newComplemento,
    newName,
    newLastName,
    newPhone,
  }: IUpdateUser) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    const phone: string | undefined =
      newPhone &&
      (await this.utilsService.verifyPhoneNumber(newPhone)).phoneNumber;

    const address: VerifyCepResponse | undefined =
      newCEP &&
      (await this.utilsService.verifyCEP(newCEP, newNumero, newComplemento));

    await this.authService.verifyTokenId(newAccess_token, user.id);

    if (newPassword || newEmail) {
      if (!password) {
        throw new HttpException('Digite a senha', HttpStatus.UNAUTHORIZED);
      }
      await this.utilsService.passwordIsCorrect(user.password, password);
    }

    if (newEmail) {
      await this.storeRepository.verifyThereIsNoStoreWithEmail(newEmail);
      await this.userRepository.verifyThereIsNoUserWithEmail(newEmail);
      await this.userRepository.verifyThereIsNoUserWithEmail(newEmail);
    }

    if (newPhone) {
      await this.storeRepository.verifyThereIsNoStoreWithPhone(phone);
      await this.userRepository.verifyThereIsNoUserWithPhone(newPhone);
    }

    const editedUser = new User(
      newEmail ? newEmail : user.email,
      newPassword ? bcrypt.hashSync(newPassword, 10) : password,
      newName ? newName.toUpperCase() : user.name,
      newLastName ? newLastName.toUpperCase() : user.lastName,
      user.dataNascimento,
      user.cpf,
      newCEP ? address.cep : user.cep,
      newCEP ? newNumero : user.numero,
      newCEP ? newComplemento : user.complemento,
      newCEP ? address.logradouro : user.logradouro,
      newCEP ? address.bairro : user.bairro,
      newCEP ? address.cidade : user.cidade,
      newCEP ? address.uf : user.uf,
      newPhone ? phone : user.mobile_phone,
    );

    if (
      editedUser.email === user.email &&
      editedUser.password === user.password &&
      editedUser.cep === user.cep &&
      editedUser.name === user.name &&
      editedUser.lastName === user.lastName &&
      editedUser.mobile_phone === user.mobile_phone
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.updateUser(editedUser);

    return {
      message: 'Usuario editado com sucesso!',
      user: editedUser,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteUser({ access_token, password }: IDeleteUser) {
    const id = await this.authService.getTokenId(access_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    await this.utilsService.passwordIsCorrect(user.password, password);

    const { newAccess_token } =
      await this.authService.getNewTokens(access_token);

    await this.authService.verifyTokenId(newAccess_token, user.id);

    await this.storeRepository.deleteUserStores(user.id);

    await this.productRepository.deleteUserProducts(user.id);

    await this.userRepository.deleteUser(user.id);

    return {
      message: 'Usuario deletado com sucesso!',
    };
  }
}
