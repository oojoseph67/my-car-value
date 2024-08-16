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
  UseInterceptors,
  Session,
  //   HttpException,
  //   UseInterceptors,
  //   ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dto/user.dto';
import { AuthService } from './auth/auth.service';
import { SignInUserDTO } from './dto/sign-in.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserInterceptor } from 'src/interceptors/current-user-interceptor';
import { UserEntity } from 'src/entity/user.entity';

@Controller('users/auth')
@Serialize(UserDTO) // this can be added to an individual method
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  //   @UseInterceptors(CurrentUserInterceptor)
  @Get('whoami')
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }
  //   whoAmI(@Session() session: any) {
  //     console.log({ session });
  //     if (!session.userId) {
  //       throw new HttpException(
  //         'Unauthorized. No session found',
  //         HttpStatus.UNAUTHORIZED,
  //       );
  //     }
  //   return this.userService.findOne({ id: session.userId });
  //   }

  @Post('signup')
  async signUp(@Body() body: CreateUserDTO, @Session() session: any) {
    const response = await this.authService.signupAuth({
      email: body.email,
      password: body.password,
    });

    session.userId = response.id;

    return response;
  }

  @Post('signin')
  async signIn(@Body() body: SignInUserDTO, @Session() session: any) {
    const response = await this.authService.signinAuth({
      email: body.email,
      password: body.password,
    });

    session.userId = response.id;

    return response;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
    return 'Sign out successfully';
  }

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

  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @UseInterceptors(new SerializeInterceptor(UserDTO))
  @Get()
  findUser(@Query('email') email: string) {
    const response = this.userService.find({ email });
    return response;
  }

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
