import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

interface Statement {
  id: string,
  user_id: string,
  type: string,
  amount: number,
  description: string
}


let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able get statements by id', async () => {
    const user: ICreateUserDTO = {
      name: 'User Test',
      email: 'test@gmail.com',
      password: '1234'
    }

    await createUserUseCase.execute(user)

    const authUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    await createStatementUseCase.execute({
      user_id: String(authUser.user.id),
      amount: 2000,
      description: 'Salario',
      type: OperationType.DEPOSIT
    })

    await createStatementUseCase.execute({
      user_id: String(authUser.user.id),
      amount: 200,
      description: 'Mercado',
      type: OperationType.WITHDRAW
    })

    const getBalance = await getBalanceUseCase.execute({ user_id: String(authUser.user.id) })

    const statement = await getStatementOperationUseCase.execute({
      user_id: String(authUser.user.id),
      statement_id: String(getBalance.statement[0].id)
    })

    expect(statement).toHaveProperty('description')
  })
})
