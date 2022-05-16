import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Auth User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able auth user', async () => {
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

    expect(authUser).toHaveProperty('token')
  })
})
