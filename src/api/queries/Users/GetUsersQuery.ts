import { IsPositive, IsOptional } from 'class-validator';

export class GetUsersQuery {
    @IsPositive()
    @IsOptional()
    page: number;

    @IsPositive()
    @IsOptional()
    limit: number;
}