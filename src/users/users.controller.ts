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
  //   UseInterceptors,
  //   ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dto/user.dto';

@Controller('users/auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('signup')
  signUp(@Body() body: CreateUserDTO) {
    const response = this.userService.create({
      email: body.email,
      password: body.password,
    });

    return response;
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
  @Serialize(UserDTO)
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
