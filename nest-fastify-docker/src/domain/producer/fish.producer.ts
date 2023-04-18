export interface FishProducer {
  produceMessage(message: string): Promise<string>;
}
