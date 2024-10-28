// DTO is a class with some properties that we expect to receive in a request body with some validation rules

import {
  IsNumber,
  IsString,
  Max,
  Min,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateReportDTO {
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  company: string;

  @IsString()
  model: string;

  @Min(1930)
  @Max(2050)
  year: number;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;

  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  mileage: number;
}
