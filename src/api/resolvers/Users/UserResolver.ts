// import { Query, Resolver } from 'type-graphql';
// import { Service } from 'typedi';
// import { UserService } from '@api/services/Users/UserService';
// import { User } from '@base/api/models/User';

// @Service()
// @Resolver((of) => User)
// export class UserResolver {
//     constructor(private userService: UserService) { }

//     @Query((returns) => [User])
//     public async users(): Promise<any> {
//         return await this.userService.getAll().then((result) => {
//             return result;
//         });
//     }
// }
