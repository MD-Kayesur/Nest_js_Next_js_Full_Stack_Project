//Guard for protect refresh token endpoints

import { AuthGuard } from "@nestjs/passport";

export class RefreshTokenGuard extends AuthGuard('jwt-refresh'){

    
} 
