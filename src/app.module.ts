import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        // Debugging (helps identify if Railway variables are being picked up)
        if (databaseUrl) {
          const host = databaseUrl.split('@')[1]?.split(':')[0] || 'unknown';
          console.log(`Attempting to connect to database host: ${host}`);
        } else {
          console.error('DATABASE_URL is not defined!');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: true,
          // Mandatory SSL for most cloud providers (like Railway/Render)
          // We only disable it if we explicitly detect localhost
          ssl: databaseUrl?.includes('localhost') || !databaseUrl ? false : { rejectUnauthorized: false },
          // Add extra connection options for stability in cloud
          extra: {
            connectionTimeoutMillis: 10000,
          }
        };
      },
      inject: [ConfigService],
    }),
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
