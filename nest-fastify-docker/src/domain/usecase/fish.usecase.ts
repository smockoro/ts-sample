import { Inject, Injectable } from '@nestjs/common';
import { Fish } from '../entity/fish';
import { FishProducer } from '../producer/fish.producer';

export interface FishUsecase {
  publishFish(fish: Fish): Promise<Fish>;
}

@Injectable()
export class DefaultFishUsecase implements FishUsecase {
  constructor(@Inject('FISH_PRODUCER') private fishProducer: FishProducer) {}
  async publishFish(fish: Fish): Promise<Fish> {
    await this.fishProducer.produceMessage(fish.name);
    return fish;
  }
}
