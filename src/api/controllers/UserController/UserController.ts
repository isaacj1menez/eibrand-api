import {JsonController, Param, Body, Get, Post, Put, Delete} from 'routing-controllers';

@JsonController()
export class UserController {
    @Get('/users')
    getAll() {
        return 'This action returns all users';
    }
}