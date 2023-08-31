import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./post.entity";

@Entity({ name: 'users', orderBy: {created_at: "DESC"} })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable:false})
    firstName:string;

    @Column({nullable:false})
    lastName:string;

    @Column({nullable:false})
    email:string;

    @Column({nullable:false})
    password:string;

    @Column({nullable:true})
    phone:string;

    @OneToMany(() => PostEntity, (post) => post.user, {cascade:true})
    posts: PostEntity[]

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;

}
