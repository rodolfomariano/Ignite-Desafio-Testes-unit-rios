
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { ICreateUserDTO } from '../createUser/ICreateUserDTO'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'


let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able get users info', async () => {
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

    const userInfo = await showUserProfileUseCase.execute(String(authUser.user.id))

    expect(userInfo).toHaveProperty('name')
  })
})
