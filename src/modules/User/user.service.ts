import { UserRepository } from './repository/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { GetUserInfoDTO } from './dto/get-userInfo.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { EditUserDTO } from './dto/edit-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { UUID } from 'crypto';
import { UtilsService, VerifyCepResponse } from 'src/utils/utils.service';
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {}

  async createUser({
    email,
    password,
    cep: incomingCep,
    cpf: incomingCpf,
    dataNascimento,
    name,
    lastName,
    phone: incomingPhone,
  }: CreateUserDTO) {
    await this.userRepository.verifyThereIsNotUserByEmail(email);

    const cpf = await this.utilsService.verifyCPF(incomingCpf);

    await this.userRepository.verifyThereIsNotUserByCPF(cpf);

    const phone = await this.utilsService.verifyPhoneNumber(incomingPhone);

    await this.userRepository.verifyThereIsNotUserByPhone(phone);

    const { transformedCep: cep, logradouro, bairro, cidade, uf } =
      await this.utilsService.verifyCEP(incomingCep);

    const hashedPassword = await this.utilsService.hashPassword(password);

    const user = new User(
      email,
      hashedPassword,
      name,
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

  async getUser({ access_token }: GetUserInfoDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id = await this.authService.getTokenId(newAccess_token)

    const user = await this.userRepository.verifyExistingUserById(id);

    await this.authService.verifyTokenId(access_token, user.id)

    return {
      user: await this.userRepository.getUserInfo(id),
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async editUser({
    access_token,
    email,
    password,
    newPassword,
    newEmail,
    newCEP,
    newCPF,
    newName,
    newLastName,
    newPhone,
  }: EditUserDTO) {
    const user = await this.userRepository.verifyExistingUserByEmail(email);

    await this.utilsService.passwordIsCorrect(user.password, password);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    await this.authService.verifyTokenId(newAccess_token, user.id);

    const { transformedCep, logradouro, bairro, cidade, uf } = newCEP
      ? await this.utilsService.verifyCEP(newCEP)
      : {
          transformedCep: null,
          logradouro: null,
          bairro: null,
          cidade: null,
          uf: null,
        };

    const editedUser: {
      id: UUID;
      email: string;
      password: string;
      cep: string;
      logradouro: string;
      bairro: string;
      cidade: string;
      uf: string;
      cpf: string;
      name: string;
      lastName: string;
      phone: string;
    } = {
      id: user.id,
      email: newEmail ? newEmail : user.email,
      password: newPassword ? bcrypt.hashSync(newPassword, 10) : password,
      cep: transformedCep ? transformedCep : user.cep,
      logradouro: logradouro ? logradouro : user.logradouro,
      bairro: bairro ? bairro : user.bairro,
      cidade: cidade ? cidade : user.cidade,
      uf: uf ? uf : user.uf,
      cpf: newCPF ? await this.utilsService.verifyCPF(newCPF) : user.cpf,
      name: newName ? newName : user.name,
      lastName: newLastName ? newLastName : user.lastName,
      phone: newPhone
        ? await this.utilsService.verifyPhoneNumber(newPhone)
        : user.phone,
    };

    if (
      editedUser.email === user.email &&
      editedUser.password === user.password &&
      editedUser.cep === user.cep &&
      editedUser.cpf === user.cpf &&
      editedUser.name === user.name &&
      editedUser.lastName === user.lastName &&
      editedUser.phone === user.phone
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.editUser(
      editedUser.id,
      editedUser.email,
      editedUser.password,
      editedUser.name,
      editedUser.lastName,
      editedUser.cep,
      editedUser.logradouro,
      editedUser.bairro,
      editedUser.cidade,
      editedUser.uf,
      editedUser.phone,
      editedUser.cpf,
    );

    return {
      message: 'Usuario editado com sucesso!',
      user: editedUser,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteUser({ access_token, email, password }: DeleteUserDTO) {
    const user = await this.userRepository.verifyExistingUserByEmail(email);

    await this.utilsService.passwordIsCorrect(user.password, password);

    const { newAccess_token } =
      await this.authService.getNewTokens(access_token);

    await this.authService.verifyTokenId(newAccess_token, user.id);

    await this.userRepository.deleteUser(user.id, user?.email);

    return {
      message: 'Usuario deletado com sucesso!',
    };
  }
}
