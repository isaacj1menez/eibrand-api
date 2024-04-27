import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsDate } from 'class-validator';

export class UserCreateRequest {
    @MaxLength(100)
    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @MaxLength(50)
    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @MaxLength(255)
    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    password: string;

    @MaxLength(50)
    @MinLength(5)
    @IsString()
    @IsNotEmpty()
    role: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}
