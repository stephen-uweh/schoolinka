import { IsNumber, IsObject, IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    title:string;

    @IsString()
    story:string;

    @IsObject()
    attachment:object;
}

export class EditPostDto {

    @IsString()
    title?:string;

    @IsString()
    story?:string;

    @IsObject()
    attachment?:object;
}

export class GetAllPostsDto {
    @IsString()
    title?:string;

    @IsNumber()
    limit?:number;

    @IsNumber()
    page?:number;
}

export class GetSinglePostDto {
    @IsString()
    postId:string
}

export class AddComment {
    @IsString()
    comment:string;
}