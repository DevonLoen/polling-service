import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  app.enableCors();
  // app.setGlobalPrefix('');

  const config = new DocumentBuilder()
    .setTitle('Endpoint Polling')
    .setDescription('List Endpoint Polling Service')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.URL_API_DOCS_BASE)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  app.enableShutdownHooks();
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
