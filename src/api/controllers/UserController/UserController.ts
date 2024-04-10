import {JsonController, Param, Body, Get, Post, Put, Delete} from 'routing-controllers';
import { Service } from 'typedi';

@JsonController()
@Service()
export class UserController {
    @Get('/users')
    getAll() {
        return 'This action returns all users';
    }
}