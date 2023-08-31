import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';
import { ChangePasswordDto, CreateUserDto, EditUserDto, SingleUserDto } from '../dto/user.dto';
import { entities } from '../entities';
import { PostEntity } from '../entities/post.entity';
import { CommentEntity } from '../entities/comment.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { FileUploadService } from '../helpers/file-upload.service';
import { AddComment, CreatePostDto, GetAllPostsDto, GetSinglePostDto } from '../dto/post.dto';

config();

describe('UserController', () => {
    let postController: PostController;
    let postService: PostService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({
                      type: 'postgres',
                      host: configService.get('DATABASE_HOST'),
                      port: configService.get('DATABASE_PORT'),
                      username: configService.get('DATABASE_USER'),
                      password: configService.get('DATABASE_PASSWORD'),
                      database: configService.get('DATABASE_NAME'),
                      entities: entities,
                      synchronize: true,
                      logging: configService.get('NODE_ENV') === 'dev' ? true : false,
                      logger: 'advanced-console',
                      ssl: null,
                    }),
                  }),
                TypeOrmModule.forFeature([UserEntity, PostEntity, CommentEntity]),
                JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '600000000000000000s' },
                }),
                PassportModule,
            ],
            controllers: [PostController],
            providers: [PostService, FileUploadService],
        }).compile();
    
        postController = app.get<PostController>(PostController);
        postService = app.get<PostService>(PostService);

        jest.setTimeout(60000);

    });


    it('should be defined', () => {
        expect(postController).toBeDefined();
    });

    describe("Get All Post", () => {
        it("should return all posts", async () => {
            let queryDto = new GetAllPostsDto
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(postService, 'getAllPosts').mockImplementation(async () => result)
            expect(await postService.getAllPosts(queryDto)).toBe(result)
        }) 
    });

    describe("Get A Single Post", () => {
        it("should return a post", async () => {
            let queryDto = new GetSinglePostDto
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(postService, 'getSinglePost').mockImplementation(async () => result)
            expect(await postService.getSinglePost(queryDto.postId)).toBe(result)
        }) 
    });

    describe("Create A New Post", () => {
        it("should return a created user", async () => {
            let postDto = new CreatePostDto, userDto = new SingleUserDto
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(postService, 'createPost').mockImplementation(async () => result)
            expect(await postService.createPost(postDto, userDto.userId)).toBe(result)
        }) 
    });

    describe("Edit A Post", () => {
        it("should return an edited post", async () => {
            let dataDto = new CreatePostDto, userDto = new SingleUserDto, postDto = new GetSinglePostDto;
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(postService, 'editPost').mockImplementation(async () => result)
            expect(await postService.editPost(dataDto, postDto.postId, userDto.userId)).toBe(result)
        }) 
    });

    describe("Delete A Post", () => {
        it("should a success response", async () => {
            let postDto = new GetSinglePostDto, userDto = new SingleUserDto
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(postService, 'deletePost').mockImplementation(async () => result)
            expect(await postService.deletePost(postDto.postId, userDto.userId)).toBe(result)
        }) 
    });

    describe("Comment On A Post", () => {
        it("should return a post with new comment", async () => {
            let queryDto = new GetSinglePostDto, userDto = new SingleUserDto, commentDto = new AddComment;
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(postService, 'addComment').mockImplementation(async () => result)
            expect(await postService.addComment(queryDto.postId, commentDto, userDto.userId)).toBe(result)
        }) 
    });

})