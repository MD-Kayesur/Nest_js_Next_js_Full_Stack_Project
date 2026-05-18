import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
//project discription
app.setGlobalPrefix('api/v1');



//set global validation pipe
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions:{
      enableImplicitConversion:true,
    }
  }),
);


//enable CORS
app.enableCors({
  origin:process.env.FRONTEND_URL|| "*"||'http://localhost:3000',
  methods:['GET','POST','PUT','PATCH','DELETE'],
  credentials:true,
});


  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch(error => {
	Logger.error("Failed to start server:",error);
	process.exit(1);
});
