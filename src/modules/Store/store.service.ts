import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreRepository } from './repository/store.repository';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../User/repository/user.repository';
import {
  UtilsService,
  VerifyCepResponse,
} from 'src/modules/utils/utils.service';
import { CreateStoreByUserDTO } from '../User/dto/create-user-store.dto';
import { LoginStoreDTO } from './dto/login-store.dto';
import { GetStoreInfoDTO } from './dto/get-store-info.dto';
import { UUID } from 'crypto';
import { IGetUserStoreInfoDTO } from '../User/dto/get-user-store-info.dto';
import { DeleteStoreDTO } from './dto/delete-store.dto';
import { IDeleteUserStoreDTO } from '../User/dto/delete-user-store.dto';
import { EditStoreDTO } from './dto/edit-store.dto';
import { EditUserStoreDTO } from '../User/dto/edit-user-store.dto';

@Injectable()
export class StoreService {
  constructor(
    private storeRepository: StoreRepository,
    private authService: AuthService,
    private userRepository: UserRepository,
    private utilsService: UtilsService,
  ) {}

  async createStore({
    cep: incomingCep,
    email,
    name,
    password,
    phone: incomingPhone,
    cnpj: incomingCnpj,
  }: CreateStoreDTO) {
    const phone: string | undefined =
      await this.utilsService.verifyPhoneNumber(incomingPhone);

    const cnpj = await this.utilsService.verifyCNPJ(incomingCnpj);

    const { cep, logradouro, bairro, cidade, uf }: VerifyCepResponse =
      await this.utilsService.verifyCEP(incomingCep);

    const hashedPassword = await this.utilsService.hashPassword(password);

    await this.storeRepository.verifyThereIsNoStoreWithName(name.toUpperCase());

    await this.storeRepository.verifyThereIsNoStoreWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithEmail(email);

    await this.storeRepository.verifyThereIsNoStoreWithPhone(phone);

    await this.userRepository.verifyThereIsNoUserWithPhone(phone);

    await this.storeRepository.verifyThereIsNoStoreWithCnpj(cnpj);

    const store = {
      email,
      password: hashedPassword,
      name: name.toUpperCase(),
      phone,
      cep,
      logradouro,
      bairro,
      cidade,
      uf,
      cnpj,
    };

    await this.storeRepository.create(store);

    return {
      store,
    };
  }

  async createStoreByUser({
    access_token,
    cep: incomingCep,
    email,
    name,
    phone: incomingPhone,
    cnpj: incomingCnpj,
  }: CreateStoreByUserDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    const address: VerifyCepResponse | undefined =
      incomingCep && (await this.utilsService.verifyCEP(incomingCep));

    const cnpj: string | undefined =
      incomingCnpj && (await this.utilsService.verifyCNPJ(incomingCnpj));

    const phone: string | undefined =
      incomingPhone &&
      (await this.utilsService.verifyPhoneNumber(incomingPhone));

    if (name) {
      await this.storeRepository.verifyThereIsNoStoreWithName(
        name.toUpperCase(),
      );
    }

    if (email) {
      await this.storeRepository.verifyThereIsNoStoreWithEmail(email);
      await this.userRepository.verifyThereIsNoUserWithEmail(email);
    }

    if (phone) {
      await this.storeRepository.verifyThereIsNoStoreWithPhone(phone);
      await this.userRepository.verifyThereIsNoUserWithPhone(phone);
    }

    if (cnpj) {
      await this.storeRepository.verifyThereIsNoStoreWithCnpj(cnpj);
    }

    const store = {
      email: email ? email : user.email,
      password: user.password,
      name: name ? name.toUpperCase() : user.name,
      phone: incomingPhone ? phone : user.phone,
      cnpj: incomingCnpj ? cnpj : null,
      cpf: user.cpf,
      cep: incomingCep ? address.cep : user.cep,
      logradouro: incomingCep ? address.logradouro : user.logradouro,
      bairro: incomingCep ? address.bairro : user.bairro,
      cidade: incomingCep ? address.cidade : user.cidade,
      uf: incomingCep ? address.uf : user.uf,
      userId: user.id,
    };

    await this.storeRepository.create(store);

    return {
      store,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async login({ email, password }: LoginStoreDTO) {
    await this.userRepository.verifyThereIsNoUserWithEmail(
      email,
      `O email ${email} é vinculado a uma conta de usuario, por favor va para user/login`,
    );

    const store = await this.storeRepository.verifyExistingStoreByEmail(email);

    await this.utilsService.passwordIsCorrect(store.password, password);

    const { access_token, refresh_token } =
      await this.authService.signIn(store);

    return {
      access_token,
      refresh_token,
    };
  }

  async getStoreInfo({ access_token }: GetStoreInfoDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id: UUID = await this.authService.getTokenId(newAccess_token);

    await this.userRepository.verifyThereIsNoUserWithId(
      id,
      `O id ${id} é vinculado a uma conta de usuario, por favor va para /user/store/info`,
    );

    const store = await this.storeRepository.verifyExistingStoreById(id);

    return {
      store: await this.storeRepository.getStoreInfo(store.id),
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async getUserStoreInfo({ access_token, storeId }: IGetUserStoreInfoDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id: UUID = await this.authService.getTokenId(newAccess_token);

    await this.storeRepository.verifyThereIsNoStoreWithId(id);

    const user = await this.userRepository.verifyExistingUserById(
      id,
      `O id ${id} é vinculado a uma conta de loja, por favor va para /store/info`,
    );

    if (storeId) {
      return {
        store: await this.storeRepository.getStoreInfo(storeId),
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
      };
    }

    return {
      stores: await this.storeRepository.getStoresInfoByUserId(user.id),
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async editStore({
    access_token,
    password,
    newCEP,
    newEmail,
    newName,
    newPassword,
    newPhone,
  }: EditStoreDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id: UUID = await this.authService.getTokenId(newAccess_token);

    await this.userRepository.verifyThereIsNoUserWithId(id);

    const store = await this.storeRepository.verifyExistingStoreById(id);

    const address: VerifyCepResponse | undefined =
      newCEP && (await this.utilsService.verifyCEP(newCEP));

    const phone: string | undefined =
      newPhone && (await this.utilsService.verifyPhoneNumber(newPhone));

    if (newPassword || newEmail) {
      if (!password) {
        throw new HttpException('Digite a senha', HttpStatus.UNAUTHORIZED);
      }
      await this.utilsService.passwordIsCorrect(store.password, password);
    }

    if (newName) {
      await this.storeRepository.verifyThereIsNoStoreWithName(newName);
    }

    if (newEmail) {
      await this.storeRepository.verifyThereIsNoStoreWithEmail(newEmail);
      await this.userRepository.verifyThereIsNoUserWithEmail(newEmail);
    }

    if (newPhone) {
      await this.storeRepository.verifyThereIsNoStoreWithPhone(phone);
      await this.userRepository.verifyThereIsNoUserWithPhone(phone);
    }

    const editedStore: {
      name: string;
      email: string;
      phone: string;
      passoword: string;
      cep: string;
      logradouro: string;
      bairro: string;
      cidade: string;
      uf: string;
    } = {
      name: newName ? newName.toUpperCase() : store.name,
      email: newEmail ? newEmail : store.email,
      phone: newPhone ? phone : store.phone,
      passoword: newPassword
        ? await this.utilsService.hashPassword(newPassword)
        : store.password,
      cep: newCEP ? address.cep : store.cep,
      logradouro: newCEP ? address.logradouro : store.logradouro,
      bairro: newCEP ? address.bairro : store.bairro,
      cidade: newCEP ? address.cidade : store.cidade,
      uf: newCEP ? address.uf : store.uf,
    };

    if (
      editedStore.cep === store.cep &&
      editedStore.name === store.name &&
      editedStore.email === store.email &&
      editedStore.passoword === store.password &&
      editedStore.phone === store.phone
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.storeRepository.editStore(
      id,
      editedStore.name,
      editedStore.email,
      editedStore.phone,
      editedStore.passoword,
      editedStore.cep,
      editedStore.logradouro,
      editedStore.bairro,
      editedStore.cidade,
      editedStore.uf,
    );

    return {
      store: editedStore,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async editUserStore({
    access_token,
    storeId,
    password,
    newCEP,
    newName,
    newEmail,
    newPhone,
  }: EditUserStoreDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id: UUID = await this.authService.getTokenId(newAccess_token);

    await this.storeRepository.verifyThereIsNoStoreWithId(id);

    const user = await this.userRepository.verifyExistingUserById(id);

    const store = await this.storeRepository.verifyExistingStoreById(storeId);

    if (store.userId !== user.id) {
      throw new HttpException(
        'O id fornecido não corresponde a nenhuma loja nesse usuário',
        HttpStatus.BAD_REQUEST,
      );
    }

    const address: VerifyCepResponse | undefined =
      newCEP && (await this.utilsService.verifyCEP(newCEP));

    const phone: string | undefined =
      newPhone && (await this.utilsService.verifyPhoneNumber(newPhone));

    if (newName) {
      await this.storeRepository.verifyThereIsNoStoreWithName(newName);
    }

    if (newEmail) {
      if (!password) {
        throw new HttpException('Digite a senha', HttpStatus.UNAUTHORIZED);
      }

      await this.storeRepository.verifyThereIsNoStoreWithEmail(newEmail);
      await this.userRepository.verifyThereIsNoUserWithEmail(newEmail);
      await this.utilsService.passwordIsCorrect(user.password, password);
    }

    if (newPhone) {
      await this.userRepository.verifyThereIsNoUserWithPhone(phone);
      await this.storeRepository.verifyThereIsNoStoreWithPhone(phone);
    }

    const editedStore: {
      name: string;
      email: string;
      phone: string;
      cep: string;
      logradouro: string;
      bairro: string;
      cidade: string;
      uf: string;
    } = {
      name: newName ? newName.toUpperCase() : store.name,
      email: newEmail ? newEmail : store.email,
      phone: newPhone ? phone : store.phone,
      cep: newCEP ? address.cep : store.cep,
      logradouro: newCEP ? address.logradouro : store.logradouro,
      bairro: newCEP ? address.bairro : store.bairro,
      cidade: newCEP ? address.cidade : store.cidade,
      uf: newCEP ? address.uf : store.uf,
    };

    if (
      editedStore.cep === store.cep &&
      editedStore.name === store.name &&
      editedStore.email === store.email &&
      editedStore.phone === store.phone
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.storeRepository.editStore(
      storeId,
      editedStore.name,
      editedStore.email,
      editedStore.phone,
      null,
      editedStore.cep,
      editedStore.logradouro,
      editedStore.bairro,
      editedStore.cidade,
      editedStore.uf,
    ); 
    
    return {
      store: editedStore,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteStore({ access_token, password }: DeleteStoreDTO) {
    const id: UUID = await this.authService.getTokenId(access_token);

    await this.userRepository.verifyThereIsNoUserWithId(id);

    const store = await this.storeRepository.verifyExistingStoreById(id);

    await this.utilsService.passwordIsCorrect(store.password, password);

    await this.authService.verifyTokenId(access_token, store.id);

    await this.storeRepository.deleteStore(id);

    return {
      message: `${store.name} deletado com sucesso`,
    };
  }

  async deleteUserStore({
    access_token,
    storeId,
    password,
  }: IDeleteUserStoreDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id: UUID = await this.authService.getTokenId(newAccess_token);

    await this.storeRepository.verifyThereIsNoStoreWithId(id);

    const user = await this.userRepository.verifyExistingUserById(id);

    const store = await this.storeRepository.verifyExistingStoreById(storeId);

    await this.utilsService.passwordIsCorrect(user.password, password);

    if (store.userId !== user.id) {
      throw new HttpException(
        'O id fornecido não corresponde a nenhuma loja nesse usuário',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.authService.verifyTokenId(access_token, user.id);

    await this.storeRepository.deleteStore(storeId);

    return {
      message: `${store.name} deletado com sucesso`,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  // encontrar lojas pelo nome
  async findStoreByName() {}

  // encontrar lojas pelo id da loja
  async findStoreById() {}

  // encontrar lojas pelo id do usuario
  async findStoreByUserId() {}

  // encontrar produtos da loja
  async searchStoreProducts() {
    // se tiver apenas o id da loja retornar todos produtos da loja
    // se tiver pesquisa retornar apenas o resultado da pesquisa
  }
}
