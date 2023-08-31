import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { CommentEntity } from "./comment.entity";

@Entity({name: "posts", orderBy:{created_at: "DESC"}})
export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable:false})
    title:string;

    @Column({nullable:false})
    story:string;

    @Column({nullable:true})
    attachment: string;

    @OneToMany(() => CommentEntity, (comments) => comments.post)
    comments: CommentEntity[];

    @Column()
    userId:string;

    @ManyToOne(() => UserEntity, (user) => user.id, {eager:true})
    user: UserEntity;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;
}