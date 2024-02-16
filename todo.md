# Modificar funcao de encontrar usuário
  - Para login é preciso retornar a senha do banco de dados
  - Para pesquisar retornar apenas nome e id

# Adicionar rotas de search

# Modificar tabela de user para store
  - id
  - nome loja 
  - email
  - password
  - cpf/cnpj
    - api verificacao de cpf/cnpj
  - endereco
  - pedidos
  - produtos
    - id
    - nome
    - preco
    - quantidade provisoria (para gerenciar pedidos)
    - quantidade

# Criar tabela de user
  - id
  - nome
  - email
  - password
  - cpf
    - api verificacao de cpf/cnpj
  - endereco
    - api para calculo de frete
  - dados para pagamento (não obrigatorio)
  - Pedidos
    - numero de pedido
    - produtos
    - data pedido
    - status
    - total
  - Carrinho
    - produtos
    - total

# Rotas Main
  - pesquisa lojas
  - pesquisa produtos
  - destaques
  - recomendacoes

# Pesquisar uma maneira de melhorar o sistema de buscas

# Integraçao API Pix

# Integração API Stripe
  - A ideia aqui seria que cada loja criasse uma conta na Stripe e cadastrasse esses dados na api
  - Dessa forma toda a lógica de gerenciamento dos produtos ficaria automatizada pela api
  - Verificar o controle de estoque da Api do Stripe
  - Configurar webhooks para gerenciar os pagamentos

# Integracao API Loggi

# Integracao API Recomendacoes google

# Uso de Sessions com Nest para lidar com sessoes de usuários

