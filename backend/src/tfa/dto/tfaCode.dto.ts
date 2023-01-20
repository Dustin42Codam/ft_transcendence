import { IsNotEmpty } from "class-validator";

export class tfaCodeDto {
  @IsNotEmpty()
  code: string;
}
