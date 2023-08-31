import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorResponse } from "../core/errors";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import * as bcryptjs from 'bcryptjs';
import { validateChangePassword, validateCreateUser, validateEditUser } from "../validation/user.validation";
import { SuccessResponse } from "../core/success";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ){}

    async createUser(data:any){
        const { error } = validateCreateUser(data);
        if (error) {
            return ErrorResponse(403, error.details[0].message, null, null);
        }
        if(data.password != data.confirmPassword){
            return ErrorResponse(403, "Passwords do not match", null, null)
        }
        const salt = await bcryptjs.genSalt(10);

        const hash = await bcryptjs.hashSync(data.password, salt);

        data.password = hash;
        try{
            let user = await this.userRepository.save(data);
            let token = await this.jwtService.sign(JSON.parse(JSON.stringify(user)))
            return SuccessResponse(201, "User created successfully", {user, token}, null)
        }
        catch(error){
            console.log(error)
            return ErrorResponse(500, "Unable to create user. Please try again", null, null)
        }
    }

    async editUser(data:any, userId:string){
        const { error } = validateEditUser(data);
        if (error) {
          return ErrorResponse(403, error.details[0].message, null, null);
        }

        let user = await this.userRepository.findOneBy({id:userId});
        if(!user){
          return ErrorResponse(403, "Forbidden", null, null);
        }

        try{
            let updatedUser = await this.userRepository.save({...user, ...data});
            return SuccessResponse(200, "User updated successfully", updatedUser, null);
        }
        catch(error){
            console.log(error);
            return ErrorResponse(500, "Error updating user details", null, null)
        }

    }

    async changePassword(data:any, userId:string){
        const { error } = validateChangePassword(data);
        if (error) {
          return ErrorResponse(403, error.details[0].message, null, null);
        }
    
        let user = await this.userRepository.findOneBy({id:userId});
        if(!user){
          return ErrorResponse(403, "Forbidden", null, null);
        }
    
        if(data.password != data.confirmPassword){
          return ErrorResponse(400, "Passwords do not match", null, null)
        }
        let passwordValid = await this.comparePassword(user.email, data.password);
        if(passwordValid){
          return ErrorResponse(400, "Cannot use previous password", null, null)
        }
    
        const salt = await bcryptjs.genSalt(10);
    
        const hash = await bcryptjs.hashSync(data.password, salt);
    
        user.password = hash;
    
        let updatedUser = await this.userRepository.save(user);
    
        const token = this.jwtService.sign(JSON.parse(JSON.stringify(updatedUser)));
    
        return SuccessResponse(200, "Password changed successfully", {token}, null)
    }

    async comparePassword(email, password) {
        let user = await this.userRepository.findOneBy({ email: email });
        if (!user) {
          return ErrorResponse(404, 'No user with this email exists', null, null);
        }
        return bcryptjs.compare(password, user.password).catch((e) => false);
    }
}