import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Perpetrator } from '../incidents/entities/perpetrator.entity';
import { CreatePerpetratorDto, UpdatePerpetratorDto } from './dto/perpetrator.dto';

@Injectable()
export class PerpetratorsService {
  constructor(
    @InjectModel(Perpetrator.name)
    private perpetratorModel: Model<Perpetrator>,
  ) {}

  async create(createPerpetratorDto: CreatePerpetratorDto): Promise<Perpetrator> {
    const perpetrator = new this.perpetratorModel(createPerpetratorDto);
    return await perpetrator.save();
  }

  async findAll(): Promise<Perpetrator[]> {
    return await this.perpetratorModel.find().exec();
  }

  async findById(id: string): Promise<Perpetrator | null> {
    return await this.perpetratorModel.findById(id).exec();
  }

  async update(id: string, updatePerpetratorDto: UpdatePerpetratorDto): Promise<Perpetrator | null> {
    return await this.perpetratorModel.findByIdAndUpdate(
      id,
      updatePerpetratorDto,
      { new: true }
    ).exec();
  }

  async search(query: string): Promise<Perpetrator[]> {
    const regex = new RegExp(query, 'i');
    return await this.perpetratorModel.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { aliases: regex },
        { knownAssociations: regex }
      ]
    }).exec();
  }
}
