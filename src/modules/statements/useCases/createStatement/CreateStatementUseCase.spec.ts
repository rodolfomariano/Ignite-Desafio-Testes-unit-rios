import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "../../../users/useCases/showUserProfile/ShowUserProfileUseCase"
import { OperationType, Statement } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"

import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able create a new Statement', async () => {
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

    const newStatement = await createStatementUseCase.execute({
      user_id: String(authUser.user.id),
      amount: 2000,
      description: 'Salario',
      type: OperationType.DEPOSIT
    })

    console.log(newStatement)

    expect(newStatement).toHaveProperty('id')
  })

  it('should not be able create a new Statement if Insufficient Funds ', async () => {
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

    // const newStatement = await createStatementUseCase.execute({
    //   user_id: String(authUser.user.id),
    //   amount: 200,
    //   description: 'Compra',
    //   type: OperationType.WITHDRAW
    // })

    // expect(newStatement).rejects.toBeInstanceOf(CreateStatementError)

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: String(authUser.user.id),
        amount: 200,
        description: 'Compra',
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

})
