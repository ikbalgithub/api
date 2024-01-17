import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path'
import { ValidationPipe } from '@nestjs/common'

(async function(){

  const app = await NestFactory.create(AppModule)

  app.enableCors(
    {
      origin: '*',
      methods: 'GET,PUT,POST',
    }
  )

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties:false,
      forbidNonWhitelisted:true,
    })
  )



  await app.listen(
    3000
  );

})()
