import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { config } from "dotenv";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { PostEntity } from "../entities/post.entity";
import { CommentEntity } from "../entities/comment.entity";

config();

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60000000000000000s' },
        }),
        PassportModule,
        TypeOrmModule.forFeature([UserEntity, PostEntity, CommentEntity]),

    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}