import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  const corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.enableCors(); // TODO: Setup cors config based on FE's server IPs
  // app.use(csurf());
  app.setGlobalPrefix('/api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Group Orders')
    .setDescription('The Group Orders API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || config.port);
}
bootstrap();
