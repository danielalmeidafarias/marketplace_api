import { UserRepository } from './repository/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { GetUserInfoDTO } from './dto/get-user-Info.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { UUID } from 'crypto';
import {
  UtilsService,
  VerifyCepResponse,
} from 'src/modules/utils/utils.service';
import { StoreRepository } from '../Store/repository/store.repository';
import { ProductRepository } from '../Product/repository/product.repository';

export interface ICreateUser {
  email: string,
  password: string,
  incomingCep: string,
  incomingCpf: string,
  dataNascimento: Date,
  name: string,
  lastName: string,
  incomingPhone: string,
}

export interface IUpdateUser {
  access_token: string,
  password: string,
  newPassword: string
  newEmail: string,
  newCEP: string,
  newName: string,
  newLastName: string,
  newPhone: string,
}

export interface IDeleteUser {
  access_token: string, 
  password: string
}

export interface IGetUserInfo {
  access_token: string
}

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private utilsService: UtilsService,
    private storeRepository: StoreRepository,
    private productRepository: ProductRepository
  ) {}

  async createUser({
    email,
    password,
    incomingCep,
    incomingCpf,
    dataNascimento,
    name,
    lastName,
    incomingPhone,
  }: ICreateUser) {
    const cpf = await this.utilsService.verifyCPF(incomingCpf);

    const phone = await this.utilsService.verifyPhoneNumber(incomingPhone);

    const { cep, logradouro, bairro, cidade, uf } =
      await this.utilsService.verifyCEP(incomingCep);

    const hashedPassword = await this.utilsService.hashPassword(password);

    await this.storeRepository.verifyThereIsNoStoreWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithCPF(cpf);

    await this.storeRepository.verifyThereIsNoStoreWithPhone(phone);

    await this.userRepository.verifyThereIsNoUserWithPhone(phone);

    const user = new User(
      email,
      hashedPassword,
      name.toUpperCase(),
      lastName,
      dataNascimento,
      cpf,
      cep,
      logradouro,
      bairro,
      cidade,
      uf,
      phone,
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
    newName,
    newLastName,
    newPhone,
  }: IUpdateUser) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    const phone: string | undefined =
      newPhone && (await this.utilsService.verifyPhoneNumber(newPhone));

    const address: VerifyCepResponse | undefined =
      newCEP && (await this.utilsService.verifyCEP(newCEP));

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
      newLastName ? newLastName : user.lastName,
      user.dataNascimento,
      user.cpf,
      newCEP ? address.cep : user.cep,
      newCEP ? address.logradouro : user.logradouro,
      newCEP ? address.bairro : user.bairro,
      newCEP ? address.cidade : user.cidade,
      newCEP ? address.uf : user.uf,
      newPhone ? phone : user.phone,
      )

    if (
      editedUser.email === user.email &&
      editedUser.password === user.password &&
      editedUser.cep === user.cep &&
      editedUser.name === user.name &&
      editedUser.lastName === user.lastName &&
      editedUser.phone === user.phone
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

    await this.storeRepository.deleteUserStores(user.id)

    await this.productRepository.deleteUserProducts(user.id)

    await this.userRepository.deleteUser(user.id);

    return {
      message: 'Usuario deletado com sucesso!',
    };
  }
}
