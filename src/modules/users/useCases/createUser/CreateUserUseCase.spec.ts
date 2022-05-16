
import response from "supertest"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Test',
      email: 'test@gmail.com',
      password: '1234'
    })

    expect(user).toHaveProperty('id')
  })
})
