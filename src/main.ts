import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { Transport,MicroserviceOptions } from '@nestjs/microservices';

(async function(){

  const app = await NestFactory.create(
    AppModule
  )

  app.enableCors(
    {
      credentials:true,
      origin: [
        'https://api-production-bdf9.up.railway.app',
        'https://4200-idx-messenger-1724914463934.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev',
        'https://ngx-messenger.vercel.app'
      ],
    }
  )

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties:false,
      forbidNonWhitelisted:true,
    })
  )

  await app.listen(
    process.env.PORT || '3000'
  );

})()
