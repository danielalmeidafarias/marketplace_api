import { Injectable } from '@nestjs/common';
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreRepository } from './repository/store.repository';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../User/repository/user.repository';
import { DataSource } from 'typeorm';
import { Store } from './entity/store.entity';
import { UtilsService, VerifyCepResponse } from 'src/utils/utils.service';

@Injectable()
export class StoreService {
  constructor(private storeRepository: StoreRepository
    , private authService: AuthService
    , private userRepository: UserRepository
    , private dataSource: DataSource
    , private utilsService: UtilsService) { }
  // criacao de loja
  async createStore({
    access_token,
    cep,
    email,
    name,
    password,
    phone,
    cpnj
  }: CreateStoreDTO) {

    await this.storeRepository.verifyExistingStore(name)

    if (access_token) {

      const { newAccess_token, newRefresh_token } =
        await this.authService.getNewTokens(access_token);

      const id = await this.authService.getTokenId(newAccess_token)

      const user = await this.userRepository.verifyExistingUserById(id);

      await this.authService.verifyTokenId(access_token, user.id)

      const address: VerifyCepResponse | undefined = cep && await this.utilsService.verifyCEP(Number(cep))

      const newStore = await this.dataSource.getRepository(Store).createQueryBuilder().insert().values({
        email: user.email,
        password: user.password,
        name: name ? name : user.name,
        phone: phone ? phone : user.phone,
        cnpj: cpnj ? cpnj : null,
        cpf: user.cpf,
        cep: cep ? address.transformedCep : user.cep,
        logradouro: cep ? address.logradouro : user.logradouro,
        bairro: cep ? address.bairro : user.bairro,
        cidade: cep ? address.cidade : user.cidade,
        uf: cep ? address.uf : user.uf,
        userId: user.id
      }).execute()

      console.log(newStore)

      // email: string,
      // password: string,
      // name: string,
      // cep: number,
      // phone: number,
      // cpnj?: number,
      // cpf?: number,

    } else {

      // Verificacao cnpj
      // Se nao tiver cnpj utilizar o cpf do usuário

      // Verificacao email


      const store = {
        email,
        password,
        name,
        phone,
        cep,
        cpnj
      }

    }




  }

  // Login da loja
  // Se a loja for ligada a algum usuario toda parte de autenticacao sera realizada com o mesmo login
  // access_token e refresh_token do usuário
  async storeLogin() { }

  // editar loja
  async editStore() { }

  // deletar loja
  async deleteStore() { }

  // encontrar lojas pelo nome
  async findStoreByName() { }

  // encontrar lojas pelo id da loja
  async findStoreById() { }

  // encontrar lojas pelo id do usuario
  async findStoreByUserId() { }

  // encontrar produtos da loja
  async searchStoreProducts() {
    // se tiver apenas o id da loja retornar todos produtos da loja
    // se tiver pesquisa retornar apenas o resultado da pesquisa
  }
}
