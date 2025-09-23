import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory(configService: ConfigService) {
        configService.get('MONGO_URI');

        return {
          uri: configService.get('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
