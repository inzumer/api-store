/** Resources */
// import bcrypt from 'bcrypt';

/** DTO */
import { UserDto, EmailUserDto, LoginUserDto, IdUserDto } from './dto';

export class UserService {
  constructor() {}

  /**
   * Creates a new user.
   * @param data - The user data to create of type CreateUserDto.
   * @returns status of creation.
   * @throws An error if the request fails or the DB returns an error.
   */
  async createUser(data: UserDto) {
    // const hash: string = await bcrypt.hash(data.password, 10);

    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(1000);

    const hash = 'hashed_password';

    try {
      return {
        ...data,
        password: hash,
      };
    } catch (error) {
      throw new Error('Error creating user:', error);
    }
  }

  /**
   * Find a user by email.
   * @param email - String of type email.
   * @returns User password found.
   * @throws An error if the request fails or the DB returns an error.
   */
  async findByEmail(email: EmailUserDto): Promise<IdUserDto> {
    try {
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      await delay(1000);

      console.log('findByEmail', email);

      const id = '';

      return {
        id,
      };
    } catch (error) {
      throw new Error('Error finding email:', error);
    }
  }

  /**
   * Validates user credentials.
   * @param data - An object containing user email and password.
   * @returns The user object if credentials are valid; otherwise, null.
   * @throws Error if the user is not found or if comparison fails.
   */
  async validateUserCredentials(data: LoginUserDto) {
    try {
      const { email, password } = data;

      const { id } = await this.findByEmail(email as unknown as EmailUserDto);

      /** Ver metodos de validación, podemos validar con el user id si matchea el pass */

      // const isValid = await bcrypt.compare(password, password);

      return { id, email, password };
    } catch (error) {
      throw new Error('Error validating user credentials:', error);
    }
  }
}
