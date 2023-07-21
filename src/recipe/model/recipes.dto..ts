import { ApiProperty } from '@nestjs/swagger';

export class createRecipeDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  ingredient: any;
}
