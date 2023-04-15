import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: '*',
  });
  const config = new DocumentBuilder()
    .setTitle('Baro gia')
    .setDescription('Baro gia description')
    .setVersion('1.0')
    .build();

  app.use(cookieParser());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swager/api', app, document);
  await app.listen(3000);
}
bootstrap();
