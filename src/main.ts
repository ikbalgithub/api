import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { RmqOptions,Transport } from '@nestjs/microservices';

(async function(){

  const app = await NestFactory.create(AppModule)

  app.enableCors(
    {
      origin: '*',
      methods: 'GET,PUT,POST',
    }
  )

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'message',
      queueOptions: {
        durable: true,
      },
    },
  });

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
