import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';

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
}
