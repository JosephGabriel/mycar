import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: string;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  longitude: number;

  @Expose()
  latitude: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: string;

  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: string;
}
