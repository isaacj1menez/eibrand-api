import { IsPositive } from 'class-validator';

export class GetUsersQuery {
    @IsPositive()
    limit?: number;

    @IsPositive()
    offset?: number;
}