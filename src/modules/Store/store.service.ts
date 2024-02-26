import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreRepository } from './repository/store.repository';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../User/repository/user.repository';
import {
  UtilsService,
  VerifyCepResponse,
} from 'src/modules/utils/utils.service';
import { LoginStoreDTO } from './dto/login-store.dto';
import { UUID } from 'crypto';
import { Store, UserStore } from './entity/store.entity';
import { ProductRepository } from '../Product/repository/product.repository';

interface ICreateStore {
  cep: string;
  email: string;
  name: string;
  password?: string;
  phone: string;
  cnpj: string;
  access_token?: string;
  refresh_token?: string;
}

interface IUpdateStore {
  access_token: string;
  refresh_token: string;
  password?: string;
  newCEP?: string;
  newEmail?: string;
  newName?: string;
  newPassword?: string;
  newPhone?: string;
  storeId?: UUID;
}

interface IDeleteStore {
  access_token: string;
  refresh_token: string;
  password?: string;
  storeId?: UUID;
}

interface IGetStoreInfo {
  access_token: string;
  refresh_token: string;
  storeId?: UUID;
}

@Injectable()
export class StoreService {
  constructor(
    private storeRepository: StoreRepository,
    private productRepository: ProductRepository,
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
  }: ICreateStore) {
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

    const store = new Store(
      email,
      name.toUpperCase(),
      hashedPassword,
      cep,
      logradouro,
      bairro,
      cidade,
      uf,
      phone,
      cnpj,
    );

    await this.storeRepository.create(store);

    const { access_token, refresh_token } =
      await this.authService.signIn(store);

    return {
      access_token,
      refresh_token,
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
  }: ICreateStore) {
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

    const store = new UserStore(
      user.id,
      user,
      email ? email : user.email,
      name ? name.toUpperCase() : user.name,
      incomingCep ? address.cep : user.cep,
      incomingCep ? address.logradouro : user.logradouro,
      incomingCep ? address.bairro : user.bairro,
      incomingCep ? address.cidade : user.cidade,
      incomingCep ? address.uf : user.uf,
      incomingPhone ? phone : user.phone,
      user.cpf,
      incomingCnpj ? cnpj : null,
    );

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

  async getStoreInfo({ access_token }: IGetStoreInfo) {
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

  async getUserStoreInfo({ access_token, storeId }: IGetStoreInfo) {
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

  async updateStore({
    access_token,
    password,
    newCEP,
    newEmail,
    newName,
    newPassword,
    newPhone,
  }: IUpdateStore) {
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

    const editedStore = new Store(
      newEmail ? newEmail : store.email,
      newName ? newName.toUpperCase() : store.name,
      newPassword
        ? await this.utilsService.hashPassword(newPassword)
        : store.password,
      newCEP ? address.cep : store.cep,
      newCEP ? address.logradouro : store.logradouro,
      newCEP ? address.bairro : store.bairro,
      newCEP ? address.uf : store.uf,
      store.phone,
      store.cnpj,
      store.id,
    );

    if (
      editedStore.cep === store.cep &&
      editedStore.name === store.name &&
      editedStore.email === store.email &&
      editedStore.password === store.password &&
      editedStore.phone === store.phone
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.storeRepository.updateStore(editedStore);

    return {
      store: editedStore,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async updateUserStore({
    access_token,
    storeId,
    password,
    newCEP,
    newName,
    newEmail,
    newPhone,
  }: IUpdateStore) {
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

    const editedStore = new UserStore(
      store.userId,
      user,
      newEmail ? newEmail : store.email,
      newName ? newName.toUpperCase() : store.name,
      newCEP ? address.cep : store.cep,
      newCEP ? address.logradouro : store.logradouro,
      newCEP ? address.bairro : store.bairro,
      newCEP ? address.cidade : store.cidade,
      newCEP ? address.uf : store.uf,
      store.phone,
      store.cpf,
      store.cnpj,
      store.id,
    );

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

    await this.storeRepository.updateStore(editedStore);

    return {
      store: editedStore,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteStore({ access_token, password }: IDeleteStore) {
    const id: UUID = await this.authService.getTokenId(access_token);

    await this.userRepository.verifyThereIsNoUserWithId(id);

    const store = await this.storeRepository.verifyExistingStoreById(id);

    await this.utilsService.passwordIsCorrect(store.password, password);

    await this.authService.verifyTokenId(access_token, store.id);

    await this.productRepository.deleteStoreProducts(store.id);

    await this.storeRepository.deleteStore(id);

    return {
      message: `${store.name} deletado com sucesso`,
    };
  }

  async deleteUserStore({ access_token, storeId, password }: IDeleteStore) {
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

    await this.productRepository.deleteStoreProducts(store.id);

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
