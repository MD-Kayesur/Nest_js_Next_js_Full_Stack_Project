import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders:['Content-Type','Authorization','accept'],
  credentials:true,
});




const config = new DocumentBuilder()
.setTitle('Nest.js REST API')
.setDescription('Nest.js REST API Documentation')
.setVersion('1.0')
// .addTag('Nest.js REST API')
.addBearerAuth({
  type:'http',
  scheme:'bearer',
  bearerFormat:'JWT',
  name:'Authorization',
  description:'Enter JWT token',
  in:'header',
},
'JWT-auth'


)
.addBearerAuth(
  {
    type:'http',
    scheme:'bearer',
    bearerFormat:'JWT',
    name:'Authorization',
    description:'Enter JWT token',
    in:'header',
  },
  'JWT-refresh'
)

.addServer('http://localhost:3001','Development server')
 .build()




const document = SwaggerModule.createDocument(app,config);
SwaggerModule.setup('api/v1/docs',app,document,{
  swaggerOptions:{
    persistAuthorization:true,
    tagsSorter:'alpha',
    operationsSorter:'alpha',
    
  },
  customSiteTitle:'API Documentation',
  customfavIcon:'https://swagger.io/favicon.icon',
  customCss: `
  .swagger-ui .topbar  { display : none }
  .swagger-ui .info {margin: 50px 0}
  .swagger-ui .info .title{font-size: 2.5em}
    
  }
  `
});




  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch(error => {
	Logger.error("Failed to start server:",error);
	process.exit(1);
});
