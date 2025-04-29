import { Injectable, Post } from '@nestjs/common';

@Injectable()
export class IdentityService {
    constructor(private identityService: IdentityService) {}

    @Post('auth')
    signin() {
        
    }

}

