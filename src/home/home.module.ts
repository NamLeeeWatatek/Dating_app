import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController, HomeControllerV2 } from './home.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [HomeController, HomeControllerV2],
  providers: [HomeService],
})
export class HomeModule {}
