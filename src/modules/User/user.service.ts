import { UserRepository } from './repository/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import {
  UtilsService,
} from 'src/modules/utils/utils.service';
import { StoreRepository } from '../Store/repository/store.repository';
import { ProductRepository } from '../Product/repository/product.repository';
import { PagarmeService } from '../Pagarme/pagarme.service';
import { UserStore } from '../Store/entity/store.entity';

export interface ICreateUser {
  email: string;
  password: string;
  incomingCep: string;
  numero: string;
  complemento: string;
  incomingCpf: string;
  birthdate: Date;
  name: string;
  incomingMobilePhone: string;
  incomingHomePhone: string;
  ponto_referencia: string;
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
  newMobilePhone: string;
  newHomePhone: string;
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
    birthdate,
    name,
    incomingMobilePhone,
    incomingHomePhone,
    ponto_referencia,
  }: ICreateUser) {
    await this.utilsService.verifyIsMaiorDeIdade(birthdate);

    const cpf = await this.utilsService.verifyCPF(incomingCpf);

    const mobile_phone = await this.utilsService.verifyPhoneNumber(incomingMobilePhone);

    const home_phone = incomingHomePhone
      ? await this.utilsService.verifyPhoneNumber(incomingHomePhone)
      : null;

    const { cep, logradouro, bairro, cidade, uf } =
      await this.utilsService.verifyCEP(incomingCep, numero, complemento);

    const hashedPassword = await this.utilsService.hashPassword(password);

    await this.storeRepository.verifyThereIsNoStoreWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithCPF(cpf);

    await this.storeRepository.verifyThereIsNoStoreWithPhone(mobile_phone);

    await this.userRepository.verifyThereIsNoUserWithPhone(mobile_phone);

    const { costumerId } = await this.pagarmeService.createUserCostumer(
      name,
      email,
      cpf,
      birthdate,
      mobile_phone,
      home_phone,
      cep,
      numero,
      complemento
    );

    const user = new User(
      costumerId,
      email,
      hashedPassword,
      name.toUpperCase(),
      birthdate,
      cpf,
      cep,
      numero,
      complemento,
      ponto_referencia,
      logradouro,
      bairro,
      cidade,
      uf,
      mobile_phone,
      home_phone ? home_phone : null,
    );

    await this.userRepository.createUser(user);

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
    newMobilePhone,
    newHomePhone,
  }: IUpdateUser) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    const mobile_phone = newMobilePhone
      ? await this.utilsService.verifyPhoneNumber(newMobilePhone)
      : await this.utilsService.verifyPhoneNumber(user.mobile_phone);

    const home_phone = newMobilePhone
      ? await this.utilsService.verifyPhoneNumber(newHomePhone)
      : user.home_phone
        ? await this.utilsService.verifyPhoneNumber(user.home_phone)
        : null;

    const address= newCEP
      ? await this.utilsService.verifyCEP(newCEP, newNumero, newComplemento)
      : await this.utilsService.verifyCEP(
          user.cep,
          user.numero,
          user.complemento,
        );

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

    if (newMobilePhone) {
      await this.storeRepository.verifyThereIsNoStoreWithPhone(
        mobile_phone,
      );
      await this.userRepository.verifyThereIsNoUserWithPhone(
        mobile_phone,
      );
    }

    const editedUser = new User(
      user.costumerId,
      newEmail ? newEmail : user.email,
      newPassword ? bcrypt.hashSync(newPassword, 10) : password,
      newName ? newName.toUpperCase() : user.name,
      user.birthdate,
      user.cpf,
      newCEP ? address.cep : user.cep,
      newCEP ? newNumero : user.numero,
      newCEP ? newComplemento : user.complemento,
      newCEP ? address.logradouro : user.logradouro,
      newCEP ? address.bairro : user.bairro,
      newCEP ? address.cidade : user.cidade,
      newCEP ? address.uf : user.uf,
      newMobilePhone ? mobile_phone : user.mobile_phone,
      newHomePhone ? home_phone : user.home_phone,
      user.id,
    );

    if (
      editedUser.email === user.email &&
      editedUser.password === user.password &&
      editedUser.cep === user.cep &&
      editedUser.name === user.name &&
      editedUser.mobile_phone === user.mobile_phone
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userStore = await this.storeRepository.findByUserId(user.id);

    if (userStore) {
      const editedUserStore = new UserStore(
        userStore.recipientId,
        user.id,
        editedUser,
        editedUser.email,
        editedUser.name,
        editedUser.birthdate,
        editedUser.cep,
        editedUser.numero,
        editedUser.complemento,
        editedUser.logradouro,
        editedUser.bairro,
        editedUser.cidade,
        editedUser.uf,
        editedUser.mobile_phone,
        editedUser.home_phone,
        editedUser.cpf,
        userStore.id,
      );

      await this.storeRepository.updateStore(editedUserStore);
    }

    await this.pagarmeService.updateUserCostumer(
      editedUser.name,
      editedUser.email, 
      editedUser.cpf,
      editedUser.birthdate,
      editedUser.mobile_phone,
      editedUser.home_phone,
      editedUser.cep,
      editedUser.numero,
      editedUser.complemento,
      editedUser.costumerId
      );

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

    await this.storeRepository.deleteUserStore(user.id);

    await this.productRepository.deleteUserProducts(user.id);

    await this.userRepository.deleteUser(user.id);

    return {
      message: 'Usuario deletado com sucesso!',
    };
  }
}
