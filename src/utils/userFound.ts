import { UserService } from "../services/user.services"

export const isUserFound=async(userId:string)=>{
    const user= await UserService.getUserByid(userId)
    if(!user){
        return false
    }
}