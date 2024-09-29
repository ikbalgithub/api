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
				'https://3000-idx-api-1724452153719.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev/graphql',
				'https://4200-idx-messenger-1726458761014.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev',
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

	await app.listen(process.env.PORT || '3000')

	const tunnel = await require("localtunnel")(
		{
			port:'3000',
			subdomain:'localhost'
		}
	)

	tunnel.on('close',() => {
		console.log('tunnels are closed')
	})

	tunnel.on('error',(err:any) => {
		console.log(err.message)
	})
})()
