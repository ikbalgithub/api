import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { Transport,MicroserviceOptions } from '@nestjs/microservices';

(async function(){

  const app = await NestFactory.create(AppModule)

  app.enableCors(
    {
      origin: '*',
      methods: 'GET,PUT,POST',
    }
  )

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RABBITMQ_URL],
  //     queue: 'microservice',
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties:false,
      forbidNonWhitelisted:true,
    })
  )

  //await app.startAllMicroservices()

  await app.listen(
    process.env.PORT || '3000'
  );

})()
