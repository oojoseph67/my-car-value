import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  Delete,
  Session,
  UseGuards,
  //   HttpException,
  //   UseInterceptors,
  //   ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDTO } from './dto/user.dto';
import { AuthService } from './auth/auth.service';
import { SignInUserDTO } from './dto/sign-in.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
// import { CurrentUserInterceptor } from '../interceptors/current-user-interceptor';
import { UserEntity } from '../entity/user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users/auth')
// Serializing a response means for returning a response in a specific format. if we want to return a response in a specific format with specific fields, we can use the Serialize decorator
@Serialize(UserDTO) // this can be added to an individual method
// @UseInterceptors(CurrentUserInterceptor) // set up interceptors globally so no need for this but it can be used as a guard when trying to setup for individual controllers
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * Retrieves the currently authenticated user.
   *
   * @UseGuards(AuthGuard)
   * @Get('whoami')
   *
   * @param user - The authenticated user entity.
   * @returns The authenticated user entity.
   */
  //   @UseInterceptors(CurrentUserInterceptor)
  @UseGuards(AuthGuard)
  @Get('whoami')
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }

  /**
   * Registers a new user.
   *
   * @Post('signup')
   *
   * @param body - The user data for registration.
   * @param session - The session object for storing user ID.
   * @returns The created user entity.
   */
  @Post('signup')
  async signUp(@Body() body: CreateUserDTO, @Session() session: any) {
    const response = await this.authService.signupAuth({
      email: body.email,
      password: body.password,
    });

    session.userId = response.id;

    return response;
  }

  /**
   * Authenticates a user.
   *
   * @Post('signin')
   *
   * @param body - The user credentials for authentication.
   * @param session - The session object for storing user ID.
   * @returns The authenticated user entity.
   */
  @Post('signin')
  async signIn(@Body() body: SignInUserDTO, @Session() session: any) {
    const response = await this.authService.signinAuth({
      email: body.email,
      password: body.password,
    });

    session.userId = response.id;

    return response;
  }

  /**
   * Signs out the currently authenticated user.
   *
   * @Post('signout')
   *
   * @param session - The session object for removing user ID.
   * @returns A success message.
   */
  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
    return 'Sign out successfully';
  }

  /**
   * Retrieves a user by their ID.
   *
   * @Get('findOne/:id')
   *
   * @param id - The ID of the user to retrieve.
   * @returns The retrieved user entity.
   */
  //   @UseInterceptors(ClassSerializerInterceptor)
  @Get('findOne/:id')
  findOneUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const response = this.userService.findOne({ id });
    return response;
  }

  /**
   * Retrieves a user by their email.
   *
   * @Get()
   *
   * @param email - The email of the user to retrieve.
   * @returns The retrieved user entity.
   */
  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @UseInterceptors(new SerializeInterceptor(UserDTO))
  @Get()
  findUser(@Query('email') email: string) {
    const response = this.userService.find({ email });
    return response;
  }

  /**
   * Updates a user by their ID.
   *
   * @Patch(':id')
   *
   * @param id - The ID of the user to update.
   * @param body - The updated user data.
   * @returns The updated user entity.
   */
  @Patch(':id')
  updateUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() body: Partial<CreateUserDTO>,
  ) {
    const response = this.userService.update({ id, userObject: body });
    return response;
  }

  /**
   * Deletes a user by their ID.
   *
   * @Delete(':id')
   *
   * @param id - The ID of the user to delete.
   * @returns The deleted user entity.
   */
  @Delete(':id')
  removeUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const response = this.userService.remove({ id });
    return response;
  }
}
