import { Module } from "@nestjs/common";
import { FruitInterfacesModule } from "./interfaces/fruit.interfaces.module";

@Module({
    imports: [FruitInterfacesModule]
})
export class FruitModule {}