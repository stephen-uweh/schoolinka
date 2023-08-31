import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { PostEntity } from "./post.entity";

@Entity({name:"comments", orderBy: {created_at: "DESC"}})
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable:false})
    comment:string;

    @Column()
    userId:string;

    @ManyToOne(() => UserEntity, (user) => user.id, {eager:true, cascade:true})
    user: UserEntity;

    @Column()
    postId:string;

    @ManyToOne(() => PostEntity, (post) => post.id, {eager:true})
    post: PostEntity;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;
}