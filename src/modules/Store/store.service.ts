import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreRepository } from './repository/store.repository';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../User/repository/user.repository';
import { UtilsService } from 'src/modules/utils/utils.service';
import { LoginStoreDTO } from './dto/login-store.dto';
import { UUID } from 'crypto';
import { Store, UserStore } from './entity/store.entity';
import { ProductRepository } from '../Product/repository/product.repository';
import { PagarmeService } from '../Pagarme/pagarme.service';
import { IManagingPartner } from './dto/create-store.dto';

interface ICreateStore {
  cep: string;
  numero: string;
  complemento: string;
  ponto_referencia: string;
  email: string;
  name: string;
  password?: string;
  mobile_phone: string;
  home_phone?: string;
  cnpj: string;
  access_token?: string;
  refresh_token?: string;
  bank_digit: string;
  branch_number: string;
  branch_check_digit: string;
  account_number: string;
  account_check_digit: string;
  account_type: 'checking' | 'savings';
  trading_name: string;
  annual_revenue: number;
  managing_partners: IManagingPartner[];
}

interface ICreateUserStore {
  access_token: string;
  refresh_token: string;
  monthly_income: number;
  professional_occupation: string;
  bank_digit: string;
  branch_number: string;
  branch_check_digit: string;
  account_number: string;
  account_check_digit: string;
  account_type: 'checking' | 'savings';
}

interface IUpdateStore {
  access_token: string;
  refresh_token: string;
  password?: string;
  newCEP?: string;
  newNumero: string;
  newComplemento?: string;
  newEmail?: string;
  newName?: string;
  newPassword?: string;
  newMobilePhone?: string;
  newHomePhone?: string;
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
    private pagarmeService: PagarmeService,
  ) {}

  async createStore({
    cep: incomingCep,
    numero,
    complemento,
    ponto_referencia,
    email,
    name: incomingName,
    password,
    mobile_phone: incomingMobilePhone,
    home_phone: incomingHomePhone,
    cnpj: incomingCnpj,
    bank_digit,
    branch_number,
    branch_check_digit,
    account_number,
    account_check_digit,
    account_type,
    annual_revenue,
    trading_name,
    managing_partners,
  }: ICreateStore) {
    const legal_representative = managing_partners.find(
      (partner) => partner.self_declared_legal_representative === true,
    );

    if (!legal_representative) {
      throw new HttpException(
        'Pelo menos um dos representantes deve ser o representante legal do cnpj',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.utilsService.verifyIsMaiorDeIdade(
      legal_representative.birthdate,
    );

    const cnpj = await this.utilsService.verifyCNPJ(incomingCnpj);

    const mobilePhoneNumber =
      await this.utilsService.verifyPhoneNumber(incomingMobilePhone);

    const homePhone = incomingHomePhone
      ? await this.utilsService.verifyPhoneNumber(incomingHomePhone)
      : null;

    const { cep, logradouro, bairro, cidade, uf } =
      await this.utilsService.verifyCEP(incomingCep, numero, complemento);

    const hashedPassword = await this.utilsService.hashPassword(password);

    const name = incomingName.toUpperCase();

    await this.storeRepository.verifyThereIsNoStoreWithName(name);

    await this.storeRepository.verifyThereIsNoStoreWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithEmail(email);

    await this.storeRepository.verifyThereIsNoStoreWithPhone(mobilePhoneNumber);

    await this.userRepository.verifyThereIsNoUserWithPhone(mobilePhoneNumber);

    await this.storeRepository.verifyThereIsNoStoreWithCnpj(cnpj);

    const { costumerId } = await this.pagarmeService.createStoreCostumer(
      name,
      email,
      cnpj,
      legal_representative.birthdate,
      mobilePhoneNumber,
      homePhone,
      cep,
      numero,
      complemento,
    );

    const { recipientId } = await this.pagarmeService.createStoreRecipient(
      name,
      trading_name,
      email,
      cnpj,
      annual_revenue,
      mobilePhoneNumber,
      homePhone,
      cep,
      numero,
      complemento,
      ponto_referencia,
      bank_digit,
      branch_check_digit,
      branch_number,
      account_number,
      account_check_digit,
      account_type,
      managing_partners,
    );

    const store = new Store(
      recipientId,
      costumerId,
      email,
      name,
      legal_representative.birthdate,
      hashedPassword,
      cep,
      numero,
      complemento,
      logradouro,
      bairro,
      cidade,
      uf,
      mobilePhoneNumber,
      homePhone ? homePhone : null,
      cnpj,
    );

    await this.storeRepository.create(store);

    return {
      store,
    };
  }

  async createStoreByUser({
    access_token,
    bank_digit: bank,
    branch_check_digit,
    branch_number,
    account_check_digit,
    account_number,
    account_type: type,
    monthly_income,
    professional_occupation,
  }: ICreateUserStore) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    await this.storeRepository.verifyThereIsNoStoreWithEmail(user.email);

    await this.storeRepository.verifyThereIsNoStoreWithPhone(user.mobile_phone);

    const { recipientId } = await this.pagarmeService.createUserRecipient(
      user.name,
      user.email,
      user.cpf,
      user.birthdate,
      monthly_income,
      professional_occupation,
      user.mobile_phone,
      user.home_phone,
      user.cep,
      user.numero,
      user.complemento,
      user.ponto_referencia,
      bank,
      branch_check_digit,
      branch_number,
      account_number,
      account_check_digit,
      type,
    );

    const store = new UserStore(
      recipientId,
      user.id,
      user,
      user.email,
      user.name,
      user.birthdate,
      user.cep,
      user.numero,
      user.complemento,
      user.logradouro,
      user.bairro,
      user.cidade,
      user.uf,
      user.mobile_phone,
      user.home_phone,
      user.cpf,
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
    newNumero,
    newComplemento,
    newEmail,
    newName,
    newPassword,
    newMobilePhone,
    newHomePhone,
  }: IUpdateStore) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const id: UUID = await this.authService.getTokenId(newAccess_token);

    await this.userRepository.verifyThereIsNoUserWithId(id);

    const store = await this.storeRepository.verifyExistingStoreById(id);

    const address = newCEP
      ? await this.utilsService.verifyCEP(newCEP, newNumero, newComplemento)
      : await this.utilsService.verifyCEP(
          store.cep,
          store.numero,
          store.complemento,
        );

    const mobile_phone = newMobilePhone
      ? await this.utilsService.verifyPhoneNumber(newMobilePhone)
      : await this.utilsService.verifyPhoneNumber(store.mobile_phone);

    const home_phone = newMobilePhone
      ? await this.utilsService.verifyPhoneNumber(newHomePhone)
      : store.home_phone
        ? await this.utilsService.verifyPhoneNumber(store.home_phone)
        : null;

    const name = newName ? newName.toUpperCase() : null;

    const newHashedPassword = newPassword
      ? await this.utilsService.hashPassword(newPassword)
      : null;

    if (newPassword || (newEmail && newEmail !== store.email)) {
      if (!password) {
        throw new HttpException('Digite a senha', HttpStatus.UNAUTHORIZED);
      }
      await this.utilsService.passwordIsCorrect(store.password, password);
    }

    if (newName && name !== store.name) {
      await this.storeRepository.verifyThereIsNoStoreWithName(name);
    }

    if (newEmail && newEmail !== store.email) {
      await this.storeRepository.verifyThereIsNoStoreWithEmail(newEmail);
      await this.userRepository.verifyThereIsNoUserWithEmail(newEmail);
    }

    if (newMobilePhone && mobile_phone !== store.mobile_phone) {
      await this.storeRepository.verifyThereIsNoStoreWithPhone(mobile_phone);
      await this.userRepository.verifyThereIsNoUserWithPhone(mobile_phone);
    }

    const editedStore = new Store(
      store.recipientId,
      store.costumerId,
      newEmail ? newEmail : store.email,
      newName ? name : store.name,
      store.birthdate,
      newPassword ? newHashedPassword : store.password,
      newCEP ? address.cep : store.cep,
      newCEP ? newNumero : store.numero,
      newCEP ? newComplemento : store.complemento,
      newCEP ? address.logradouro : store.logradouro,
      newCEP ? address.bairro : store.bairro,
      newCEP ? address.cidade : store.cidade,
      newCEP ? address.uf : store.uf,
      newMobilePhone ? mobile_phone : store.mobile_phone,
      newHomePhone ? home_phone : store.home_phone,
      store.cnpj,
      store.id,
    );

    if (
      editedStore.cep === store.cep &&
      editedStore.name === store.name &&
      editedStore.email === store.email &&
      editedStore.password === store.password &&
      editedStore.mobile_phone === store.mobile_phone &&
      editedStore.home_phone === store.home_phone
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.pagarmeService.updateStoreCostumer(
      editedStore.name,
      editedStore.email,
      editedStore.cnpj,
      editedStore.birthdate,
      editedStore.mobile_phone,
      editedStore.home_phone,
      editedStore.cep,
      editedStore.numero,
      editedStore.complemento,
      editedStore.costumerId
    );

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

  async searchStore(name?: string, id?: UUID) {
    if (!id && !name) {
      throw new HttpException(
        'Pelo menos um dos parametros deve ser passado: name, id',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (id) {
      const store = await this.storeRepository.verifyExistingStoreById(id);
      const filteredStore = {
        id: store.id,
        name: store.name,
        cep: store.cep,
        logradouro: store.logradouro,
        bairro: store.bairro,
        cidade: store.cidade,
        uf: store.uf,
        mobile_phone: store.mobile_phone,
        home_phone: store.home_phone,
      };
      return {
        store: filteredStore,
      };
    }

    const stores = await this.storeRepository.searchManyByName(name);
    const filteredStore = Array.from(stores, (store) => {
      return {
        id: store.id,
        name: store.name,
        cep: store.cep,
        logradouro: store.logradouro,
        bairro: store.bairro,
        cidade: store.cidade,
        uf: store.uf,
        mobile_phone: store.mobile_phone,
        home_phone: store.home_phone,
      };
    });

    return { stores: filteredStore };
  }

  async searchProducts(storeId: UUID, name?: string, productId?: UUID) {
    await this.storeRepository.verifyExistingStoreById(storeId);

    if (!name && !productId) {
      const products = await this.productRepository.findManyByStoreId(storeId);
      const filteredProducts = Array.from(products, (product) => {
        return {
          id: product.id,
          storeId: product.storeId,
          name: product.name,
          description: product.description,
          price: product.price,
        };
      });

      return {
        products: filteredProducts,
      };
    }

    if (productId) {
      const product =
        await this.productRepository.verifyExistingProductById(productId);
      const filteredProduct = {
        id: product.id,
        storeId: product.storeId,
        name: product.name,
        description: product.description,
        price: product.price,
      };
      return {
        product: filteredProduct,
      };
    }

    const products = await this.productRepository.searchManyByNameAndStore(
      name,
      storeId,
    );

    const filteredProducts = Array.from(products, (product) => {
      return {
        id: product.id,
        storeId: product.storeId,
        name: product.name,
        description: product.description,
        price: product.price,
      };
    });

    return { products: filteredProducts };
  }
}
