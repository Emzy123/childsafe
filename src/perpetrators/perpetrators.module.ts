import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerpetratorsController } from './perpetrators.controller';
import { PerpetratorsService } from './perpetrators.service';
import { Perpetrator, PerpetratorSchema } from '../incidents/entities/perpetrator.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Perpetrator.name, schema: PerpetratorSchema }])],
  controllers: [PerpetratorsController],
  providers: [PerpetratorsService],
  exports: [PerpetratorsService],
})
export class PerpetratorsModule {}
