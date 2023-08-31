import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { config } from 'dotenv';
import { UserEntity } from "../entities/user.entity";
import { PostEntity } from "../entities/post.entity";
import { CommentEntity } from "../entities/comment.entity";
import { FileUploadService } from "../helpers/file-upload.service";
import { UserService } from "../user/user.service";

config();

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    PassportModule, 
    TypeOrmModule.forFeature([UserEntity, PostEntity, CommentEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600000000000000000s' },
    }),
  ],
  providers: [AuthService, 
    LocalStrategy, JwtStrategy, 
    AuthService, FileUploadService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}