import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { PostEntity } from "../entities/post.entity";
import { CommentEntity } from "../entities/comment.entity";
import { FileUploadService } from "../helpers/file-upload.service";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";

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
    controllers: [PostController],
    providers: [PostService,FileUploadService]
})
export class PostModule {}