import { Body, Controller, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { ChangePasswordDto, CreateUserDto, EditUserDto } from "../dto/user.dto";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { CreatePostDto } from "../dto/post.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Post('create')
    async createUser(@Res() res, @Body() body:CreateUserDto){
        let response = await this.userService.createUser(body);
        return res.status(response.responseCode).send(response);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Patch('edit')
    async editUser(@Res() res, @Req() req, @Body() body:EditUserDto){
        let response = await this.userService.editUser(body, req.user.user.id);
        return res.status(response.responseCode).send(response);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Res() res, @Req() req, @Body() body:ChangePasswordDto){
        let response = await this.userService.changePassword(body, req.user.user.id);
        return res.status(response.responseCode).send(response)
    }
}