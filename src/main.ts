import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_URL,
    exposedHeaders: ['content-range'],
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('GymAPI')
    .setDescription('Documentation of the Gym API')
    .setVersion('1.0.0')
    .addTag('gym')
    .build();
  const xsd = "xsd"
  const test = "a"
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
