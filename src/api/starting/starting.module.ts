import { Module } from '@nestjs/common'

import { StartingController } from './starting.controller'

@Module({
  controllers: [StartingController]
})
export class StartingModule {}
