//Roles guard 
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { ROLE_KEY } from "../decorators/roles.decorators";



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector:Reflector) {}
    canActivate(context:ExecutionContext):boolean{
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY,[context.getHandler(),context.getClass()]);
        if(!requiredRoles || requiredRoles.length === 0){
            return true;
        }
        const {user} = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role === role);
    }
}