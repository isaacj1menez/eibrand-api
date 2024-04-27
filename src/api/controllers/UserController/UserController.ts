import { GetUsersQuery } from '@base/api/queries/Users/GetUsersQuery';
import { UserCreateRequest } from '@base/api/requests/Users/UserCreateRequest';
import { UserService } from '@base/api/services/Users/UserService';
import { createCommonResponse } from '@base/utils/create-common-response';
import { JsonController, Body, Get, Post, HttpCode, QueryParams } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@OpenAPI({
    security: [{ bearerAuth: [] }],
})
@JsonController('/users')
export class UserController {

    public constructor(private userService: UserService) { }

    @Get()
    public async getAll(@QueryParams() query: GetUsersQuery) {
        const data = await this.userService.getAll(query.offset, query.limit);
        return createCommonResponse(true, 200, 'OK', data);
    }

    @Post()
    @HttpCode(201)
    public async create(@Body() user: UserCreateRequest) {
        const data = await this.userService.create(user);
        return createCommonResponse(true, 201, 'User created successfully.', data);
    }
}