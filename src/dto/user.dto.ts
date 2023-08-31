import { IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    email: string;

    @IsString()
    password:string;

    @IsString()
    confirmPassword:string;

    @IsString()
    phone?: string;
}

export class LoginInput {
    @IsString()
    email: string;

    @IsString()
    password: string;
}

export class EditUserDto {
    @IsString()
    firstName?:string;

    @IsString()
    lastName?:string;

    @IsString()
    phone?:string;
}

export class ChangePasswordDto {
    @IsString()
    password:string;

    @IsString()
    confirmPassword:string;
}

export class SingleUserDto {
    @IsString()
    userId:string
}