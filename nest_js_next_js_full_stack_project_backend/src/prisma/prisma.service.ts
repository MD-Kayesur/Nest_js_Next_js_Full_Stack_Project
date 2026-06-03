import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { log } from 'console';
import { startWith } from 'rxjs';
 
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
   
constructor() {
    const adapter= new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    })
	super({
		adapter,
        log:process.env.NODE_ENV==='development' ? ['query','error','warn','info'] : ['error'],
		
	});
}
async onModuleInit() {
	await this.$connect();
    console.log('Prisma connected successfully');
}
async onModuleDestroy() {
	await this.$disconnect();
    console.log('Prisma disconnected');
}
 

async cleanDatabase() {
    if (process.env.NODE_ENV !== 'production') {
        throw new Error('Not allowed to clean database in production');
    }
    const modal = Reflect.ownKeys(this).filter((key)=> typeof key=== "string" && !key.startsWith('_') );
    return Promise.all(modal.map((modelKey)=> {
        if (typeof modelKey === 'string') {
             return (this[modelKey] as any).deleteMany();
        }
    }));
    
}

}
