import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorResponse } from "../core/errors";
import { SuccessResponse } from "../core/success";
import { CommentEntity } from "../entities/comment.entity";
import { PostEntity } from "../entities/post.entity";
import { FileUploadService } from "../helpers/file-upload.service";
import { validateCreatePost, validateEditPost } from "../validation/post.validation";
import { Like, Repository } from "typeorm";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
        private fileUploadService: FileUploadService

    ){}

    async getAllPosts(query:any){
        let take = query.limit ? parseInt(query.limit) : 10;
        let page = query.page ? parseInt(query.page) : 1;
        let skip = (page-1)*take;
        delete query.limit;
        delete query.page;

        let title = query.title ? query.title : ""
        let posts = await this.postRepository.find({where: 
            [
                {title: Like('%' + title + '%')}, 
                {}
            ],
            relations: ['user', 'comments']
        });

        let end = take * page;
        let allPosts = posts.slice(skip,end);

        let data = {
            count: posts.length,
            page: page,
            posts: allPosts
        }
        
        return SuccessResponse(200, "All blog posts fetched successfully", data, null);
    }

    async getSinglePost(postId:string){
        let post = await this.postRepository.findOne({where: {id:postId}, relations: ['user', 'comments']});

        if(post){
            return SuccessResponse(200, "Post fetched successfully", post, null);
        }
        return ErrorResponse(404, "Post not found", null, null);
    }

    async createPost(data:any, userId:string){
        const { error } = validateCreatePost(data);
        if (error) {
          return ErrorResponse(403, error.details[0].message, null, null);
        }
        if(data.attachment){
            let url = await this.fileUploadService.uploadSingleItem(data.attachment);
            data.attachment = url;
        }
        data['userId'] = userId;

        try{
            let newPost = await this.postRepository.save(data);
            return SuccessResponse(201, "Post created successfully", newPost, null);
        }
        catch(error){
            console.log(error);
            return ErrorResponse(500, "Unable to create post. Please try again", null, null)
        }
    }

    async editPost(data:any, postId:string, userId:string){
        const { error } = validateEditPost(data);
        if (error) {
          return ErrorResponse(403, error.details[0].message, null, null);
        }
        console.log("Post ID here", postId)
        // let post = await this.postRepository.findOne({where: {id:postId}, relations: ['user', 'comments']});
        let post = await this.postRepository.findOneBy({id:postId});
        console.log("HERE@!!!!!!!!!!!", post)
        if(!post){
            return ErrorResponse(404, "Post not found", null, null)
        }
        if(post.userId != userId){
            return ErrorResponse(403, "Forbidden action", null, null)
        }
        if(data.attachment){
            let url = await this.fileUploadService.uploadSingleItem(data.attachment);
            data.attachment = url;
        }
        let postData = {...post, ...data};
        let updatedPost = await this.postRepository.save(postData);

        return SuccessResponse(201, "Post edited successfully", updatedPost, null);

    }

    async deletePost(postId:string, userId:string){
        let post = await this.postRepository.findOne({where: {id:postId}, relations: ['user', 'comments']});
        if(!post){
            return ErrorResponse(404, "Post not found", null, null)
        }
        if(post.userId != userId){
            return ErrorResponse(403, "Forbidden action", null, null)
        }
        await this.postRepository.delete(postId);
        return SuccessResponse(200, "Post deleted", null, null)
    }

    async addComment(postId:string, data:any, userId:string){
        let post = await this.postRepository.findOne({where: {id:postId}, relations: ['user', 'comments']});
        if(!post){
            return ErrorResponse(404, "Post not found. Might have been deleted", null, null);
        }
        await this.commentRepository.save({
            comment: data.comment,
            userId:userId,
            postId:postId
        });
        return SuccessResponse(200, "Comment added to post", post, null);
    }
}