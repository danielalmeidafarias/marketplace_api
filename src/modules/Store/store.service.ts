import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreRepository } from './repository/store.repository';
import { AuthService } from '../Auth/auth.service';
import { UserRepository } from '../User/repository/user.repository';
import { UtilsService } from 'src/modules/Utils/utils.service';
import { UUID } from 'crypto';
import { Store, UserStore } from './entity/store.entity';
import { ProductRepository } from '../Product/repository/product.repository';
import { PagarmeService } from '../Pagarme/pagarme.service';
import { IManagingPartner } from './dto/create-store.dto';
import {
  ManagingPartner,
  RegisterInformationPJ,
} from '../Pagarme/classes/Recipient';
import { CartRepository } from '../Cart/repository/cart.repository';
import { Costumer } from '../Pagarme/classes/Costumer';
import { BankAccount, Recipient } from '../Pagarme/classes/Recipient';
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
  newNumero?: string;
  newComplemento?: string;
  new_ponto_referencia?: string;
  newEmail?: string;
  newName?: string;
  newPassword?: string;
  newMobilePhone?: string;
  newHomePhone?: string;
  new_trading_name?: string;
  new_annual_revenue?: number;
  new_managing_partners?: IManagingPartner[];
  storeId?: UUID;
}

interface IDeleteStore {
  access_token: string;
  refresh_token: string;
  password?: string;
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
    private cartRepository: CartRepository,
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
    managing_partners: incoming_managing_partners,
  }: ICreateStore) {
    const legal_representative = incoming_managing_partners.find(
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

    const mobile_phone =
      await this.utilsService.verifyPhoneNumber(incomingMobilePhone);

    const home_phone = incomingHomePhone
      ? await this.utilsService.verifyPhoneNumber(incomingHomePhone)
      : null;

    const { cep, logradouro, bairro, cidade, uf } =
      await this.utilsService.verifyCEP(incomingCep);

    const hashedPassword = await this.utilsService.hashPassword(password);

    const name = incomingName.toUpperCase();

    await this.storeRepository.verifyThereIsNoStoreWithName(name);

    await this.storeRepository.verifyThereIsNoStoreWithEmail(email);

    await this.userRepository.verifyThereIsNoUserWithEmail(email);

    await this.storeRepository.verifyThereIsNoStoreWithPhone(mobile_phone);

    await this.userRepository.verifyThereIsNoUserWithPhone(home_phone);

    await this.storeRepository.verifyThereIsNoStoreWithCnpj(cnpj);

    const costumer_mobile_phone =
      await this.utilsService.transformCostumerPhone(incomingMobilePhone);

    const costumer_home_phone = incomingHomePhone
      ? await this.utilsService.transformCostumerPhone(incomingHomePhone)
      : null;

    const address = await this.utilsService.transformCostumerAddress(
      cep,
      numero,
      complemento,
    );

    const costumer = new Costumer({
      document_type: 'CNPJ',
      type: 'company',
      name,
      email,
      document: cnpj,
      birthdate: legal_representative.birthdate,
      phones: {
        mobile_phone: costumer_mobile_phone,
        home_phone: costumer_home_phone,
      },
      address,
    });

    const { costumerId } = await this.pagarmeService.createCostumer(costumer);

    const recipient_phone_numbers = home_phone
      ? await this.utilsService.transformRecipientPhone(
          mobile_phone,
          home_phone,
        )
      : await this.utilsService.transformRecipientPhone(mobile_phone);

    const recipient_main_address =
      await this.utilsService.transformRecipientAddress(
        cep,
        numero,
        complemento,
        ponto_referencia,
      );

    const default_bank_account = new BankAccount({
      bank: bank_digit,
      branch_number,
      branch_check_digit,
      account_number,
      account_check_digit,
      holder_document: cnpj,
      holder_name: name,
      holder_type: 'individual',
      type: account_type,
    });

    const managing_partners: ManagingPartner[] = [];

    for (let i = 0; i < incoming_managing_partners.length; i++) {
      const phone_numbers = await this.utilsService.transformRecipientPhone(
        mobile_phone,
        home_phone,
      );
      const address = await this.utilsService.transformRecipientAddress(
        cep,
        numero,
        complemento,
        ponto_referencia,
      );

      const managing_partner = new ManagingPartner({
        self_declared_legal_representative:
          incoming_managing_partners[i].self_declared_legal_representative,
        name: incoming_managing_partners[i].name,
        email: incoming_managing_partners[i].email,
        address,
        phone_numbers,
        birthdate: incoming_managing_partners[i].birthdate,
        document: cnpj,
        monthly_income: incoming_managing_partners[i].monthly_income,
        professional_occupation:
          incoming_managing_partners[i].professional_occupation,
      });

      managing_partners.push(managing_partner);
    }

    const recipient = new Recipient({
      register_information: {
        type: 'corporation',
        company_name: name,
        email,
        document: cnpj,
        phone_numbers: recipient_phone_numbers,
        main_address: recipient_main_address,
        annual_revenue,
        trading_name,
        managing_partners,
      },
      default_bank_account,
    });

    const { recipientId } =
      await this.pagarmeService.createRecipient(recipient);

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
      mobile_phone,
      home_phone ? home_phone : null,
      cnpj,
    );

    const { storeId } = await this.storeRepository.create(store);

    await this.cartRepository.create(storeId);

    return {
      store,
    };
  }

  async createStoreByUser({
    access_token,
    refresh_token,
    bank_digit: bank,
    branch_check_digit,
    branch_number,
    account_check_digit,
    account_number,
    account_type: type,
    monthly_income,
    professional_occupation,
  }: ICreateUserStore) {
    const { user, newAccess_token, newRefresh_token } =
      await this.authService.userVerification(access_token, refresh_token);

    await this.storeRepository.verifyThereIsNoStoreWithEmail(user.email);

    await this.storeRepository.verifyThereIsNoStoreWithPhone(user.mobile_phone);

    const recipient_phone_numbers =
      await this.utilsService.transformRecipientPhone(
        user.mobile_phone,
        user.home_phone,
      );

    const recipient_address = await this.utilsService.transformRecipientAddress(
      user.cep,
      user.numero,
      user.complemento,
      user.ponto_referencia,
    );
    const birthdate = user.birthdate.toLocaleDateString('BR');

    const default_bank_account = new BankAccount({
      bank,
      branch_number,
      branch_check_digit,
      account_number,
      account_check_digit,
      holder_document: user.cpf,
      holder_name: user.name,
      holder_type: 'individual',
      type,
    });

    const recipient = new Recipient({
      register_information: {
        type: 'individual',
        name: user.name,
        email: user.email,
        document: user.cpf,
        professional_occupation,
        monthly_income,
        phone_numbers: recipient_phone_numbers,
        address: recipient_address,
        birthdate,
      },
      default_bank_account,
    });

    const { recipientId } =
      await this.pagarmeService.createRecipient(recipient);

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

  async getStoreInfo({ access_token, refresh_token }: IGetStoreInfo) {
    const { store, newAccess_token, newRefresh_token } =
      await this.authService.storeVerification(access_token, refresh_token);

    return {
      store: await this.storeRepository.getStoreInfo(store.id),
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async getUserStoreInfo({
    access_token,
    refresh_token,
    storeId,
  }: IGetStoreInfo) {
    const { user, newAccess_token, newRefresh_token } =
      await this.authService.userVerification(access_token, refresh_token);

    const store = await this.storeRepository.verifyExistingStoreByUserId(
      user.id,
    );

    if (storeId) {
      return {
        store: await this.storeRepository.getStoreInfo(storeId),
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
      };
    }

    return {
      store,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async updateStore({
    access_token,
    refresh_token,
    password,
    newCEP,
    newNumero,
    newComplemento,
    new_ponto_referencia,
    newEmail,
    newName,
    newPassword,
    newMobilePhone,
    newHomePhone,
    new_annual_revenue,
    new_managing_partners: incoming_new_managing_partners,
    new_trading_name,
  }: IUpdateStore) {
    const { store, newAccess_token, newRefresh_token } =
      await this.authService.storeVerification(access_token, refresh_token);

    const address = newCEP
      ? await this.utilsService.verifyCEP(newCEP)
      : await this.utilsService.verifyCEP(store.cep);

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
      await this.authService.storeLogin(store.email, password);
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

    await this.updatePJCostumer(store.costumerId, editedStore, {
      newCEP,
      newHomePhone,
      newMobilePhone,
    });

    await this.updatePJRecipient(store.recipientId, editedStore, {
      new_annual_revenue,
      new_managing_partners: incoming_new_managing_partners,
      new_ponto_referencia,
      new_trading_name,
      newCEP,
      newComplemento,
      newEmail,
      newHomePhone,
      newMobilePhone,
      newName,
      newNumero,
    });

    await this.storeRepository.updateStore(editedStore);

    return {
      store: editedStore,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  private async updatePJRecipient(
    recipient_id: string,
    editedStore: Store,
    {
      newCEP,
      newComplemento,
      newHomePhone,
      newMobilePhone,
      newNumero,
      new_annual_revenue,
      new_managing_partners: incoming_new_managing_partners,
      new_ponto_referencia,
      new_trading_name,
    }: Pick<
      Partial<IUpdateStore>,
      | 'newCEP'
      | 'newNumero'
      | 'newComplemento'
      | 'new_ponto_referencia'
      | 'newMobilePhone'
      | 'newHomePhone'
      | 'newName'
      | 'newEmail'
      | 'new_annual_revenue'
      | 'new_managing_partners'
      | 'new_trading_name'
    >,
  ) {
    // Obtendo o Recipient da API da Pagarme
    const { recipient: pagarme_api_recipient } =
      await this.pagarmeService.getRecipient(recipient_id);

    // Criando o array e números
    const new_recipient_phone_numbers = editedStore.home_phone
      ? await this.utilsService.transformRecipientPhone(
          editedStore.mobile_phone,
          editedStore.home_phone,
        )
      : await this.utilsService.transformRecipientPhone(
          editedStore.mobile_phone,
        );

    // Criando objeto de Main_address
    const new_recipient_main_address =
      newCEP && newNumero && newComplemento && new_ponto_referencia
        ? await this.utilsService.transformRecipientAddress(
            newCEP
              ? newCEP
              : pagarme_api_recipient.register_information.main_address
                  .zip_code,
            newNumero
              ? newNumero
              : pagarme_api_recipient.register_information.main_address
                  .zip_code,
            newComplemento,
            new_ponto_referencia,
          )
        : null;

    // Criando Array de Managing Partners
    const new_managing_partners: ManagingPartner[] = [];

    if (incoming_new_managing_partners) {
      for (let i = 0; i < incoming_new_managing_partners.length; i++) {
        const phone_numbers = await this.utilsService.transformRecipientPhone(
          incoming_new_managing_partners[i].mobile_phone,
          incoming_new_managing_partners[i].home_phone,
        );

        const address = await this.utilsService.transformRecipientAddress(
          incoming_new_managing_partners[i].cep,
          incoming_new_managing_partners[i].numero,
          incoming_new_managing_partners[i].complemento,
          incoming_new_managing_partners[i].ponto_referencia,
        );

        const managing_partner = new ManagingPartner({
          self_declared_legal_representative:
            incoming_new_managing_partners[i]
              .self_declared_legal_representative,
          name: incoming_new_managing_partners[i].name,
          email: incoming_new_managing_partners[i].email,
          address,
          phone_numbers,
          birthdate: incoming_new_managing_partners[i].birthdate,
          document: editedStore.cnpj,
          monthly_income: incoming_new_managing_partners[i].monthly_income,
          professional_occupation:
            incoming_new_managing_partners[i].professional_occupation,
        });
        new_managing_partners.push(managing_partner);
      }
    }

    // Criando objeto de RegisterInformation para PJ
    const new_register_information = new RegisterInformationPJ({
      annual_revenue: new_annual_revenue
        ? new_annual_revenue
        : Number(pagarme_api_recipient.register_information.annual_revenue),
      company_name: editedStore.name,
      document: pagarme_api_recipient.register_information.document,
      email: editedStore.email,
      main_address: newCEP
        ? new_recipient_main_address
        : pagarme_api_recipient.register_information.main_address,
      managing_partners: incoming_new_managing_partners
        ? new_managing_partners
        : pagarme_api_recipient.register_information.managing_partners,
      phone_numbers:
        newHomePhone || newMobilePhone
          ? new_recipient_phone_numbers
          : pagarme_api_recipient.register_information.phone_numbers,
      trading_name: new_trading_name
        ? new_trading_name
        : pagarme_api_recipient.register_information.trading_name,
    });

    const new_recipient = new Recipient({
      default_bank_account: undefined,
      register_information: new_register_information,
      recipient_id: editedStore.recipientId,
    });

    const { response } =
      await this.pagarmeService.updateRecipient(new_recipient);
    console.log(response);
    return response;
  }

  private async updatePJCostumer(
    costumer_id: string,
    editedStore: Store,
    {
      newCEP,
      newHomePhone,
      newMobilePhone,
    }: Pick<
      Partial<IUpdateStore>,
      | 'newCEP'
      | 'newNumero'
      | 'newComplemento'
      | 'new_ponto_referencia'
      | 'newMobilePhone'
      | 'newHomePhone'
      | 'newName'
      | 'newEmail'
      | 'new_annual_revenue'
      | 'new_managing_partners'
      | 'new_trading_name'
    >,
  ) {
    const { costumer: pagarme_api_costumer } =
      await this.pagarmeService.getCostumer(costumer_id);

    const costumer_mobile_phone = newMobilePhone
      ? await this.utilsService.transformCostumerPhone(editedStore.mobile_phone)
      : pagarme_api_costumer.phones.mobile_phone;

    const costumer_home_phone = newHomePhone
      ? await this.utilsService.transformCostumerPhone(editedStore.home_phone)
      : pagarme_api_costumer.phones.home_phone;

    const costumer_address = newCEP
      ? await this.utilsService.transformCostumerAddress(
          editedStore.cep,
          editedStore.numero,
          editedStore.complemento,
        )
      : pagarme_api_costumer.address;

    const new_costumer = new Costumer({
      name: editedStore.name,
      email: editedStore.email,
      costumer_Id: editedStore.costumerId,
      document_type: 'CNPJ',
      type: 'company',
      document: editedStore.cnpj,
      birthdate: editedStore.birthdate,
      phones: {
        mobile_phone: costumer_mobile_phone,
        home_phone: costumer_home_phone,
      },
      address: costumer_address,
    });

    const { response } = await this.pagarmeService.updateCostumer(new_costumer);

    console.log(response);

    return response;
  }

  async deleteStore({ access_token, refresh_token, password }: IDeleteStore) {
    const { store } = await this.authService.storeVerification(
      access_token,
      refresh_token,
    );

    await this.authService.storeLogin(store.password, password);

    await this.authService.storeLogin(store.password, password);

    await this.productRepository.deleteStoreProducts(store.id);

    await this.cartRepository.delete(store.id);

    await this.storeRepository.deleteStore(store.id);

    return {
      message: `${store.name} deletado com sucesso`,
    };
  }

  async deleteUserStore({
    access_token,
    refresh_token,
    password,
  }: IDeleteStore) {
    const { user, newAccess_token, newRefresh_token } =
      await this.authService.userVerification(access_token, refresh_token);

    const store = await this.storeRepository.verifyExistingStoreByUserId(
      user.id,
    );

    await this.authService.userLogin(user.password, password);

    await this.productRepository.deleteStoreProducts(store.id);

    await this.storeRepository.deleteStore(store.id);

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
