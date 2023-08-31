import { Body, Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";
import { AddComment, CreatePostDto, EditPostDto, GetAllPostsDto, GetSinglePostDto } from "../dto/post.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";

@ApiTags("Posts")
@Controller("posts")
export class PostController {
    constructor(
        private postService: PostService
    ){}

    @Get('all')
    async getAllPosts(@Res() res, @Query() query:GetAllPostsDto){
        let response = await this.postService.getAllPosts(query);
        return res.status(response.responseCode).send(response);
    }

    @Get('single')
    async getSinglePost(@Res() res, @Query() query:GetSinglePostDto){
        let response = await this.postService.getSinglePost(query.postId);
        return res.status(response.responseCode).send(response);
    }

    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('attachment'))
    async createPost(@Res() res, 
    @Req() req, 
    @UploadedFile() file:Express.Multer.File,
    @Body() body:CreatePostDto){
        if(file){
            body['attachment'] = file;
        }
        let response = await this.postService.createPost(body, req.user.user.id);
        return res.status(response.responseCode).send(response);
    }

    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @Patch('edit')
    @UseInterceptors(FileInterceptor('attachment'))
    async editPost(@Res() res, @Req() req, @UploadedFile() file:Express.Multer.File, @Query() query:GetSinglePostDto, @Body() body:EditPostDto){
        if(file){
            body['attachment'] = file;
        }
        let response = await this.postService.editPost(body, query.postId, req.user.user.id);
        return res.status(response.responseCode).send(response);
    }


    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @Post('comment')
    async addComment(@Res() res, @Req() req, @Query() query:GetSinglePostDto, @Body() body:AddComment){
        let response = await this.postService.addComment(query.postId, body, req.user.user.id);
        return res.status(response.responseCode).send(response);
    }
}
