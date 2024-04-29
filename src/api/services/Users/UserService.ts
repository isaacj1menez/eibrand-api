import { UserRepository } from "@base/api/repositories/Users/UserRepository";
import { EventDispatcher, EventDispatcherInterface } from "@base/decorators/EventDispatcher";
import { UserNotFoundException } from "@base/errors/Users/UserNotFoundException";
import { Service } from "typedi";

@Service()
export class UserService {
    constructor(@EventDispatcher() private eventDispatcher: EventDispatcherInterface) { }

    public getAll = async (page: number = 1, limit: number = 10, retrieveAll: boolean = false) => {
        if (retrieveAll) {
            const data = await UserRepository.find();
            const entries = data.length;
            const users = data.map(u => { const { password, ...user } = u; return user });
            return { entries, users };
        } else {
            const [totalEntries, data] = await Promise.all([
                UserRepository.count(),
                UserRepository.find({
                    skip: (page - 1) * limit,
                    take: limit
                })
            ]);
            const entries = totalEntries;
            const users = data.map(u => { const { password, ...user } = u; return user });
            
            const currentPage = page;
            const totalPages = Math.ceil(totalEntries / limit);
    
            return { entries, users, currentPage, totalPages };
        }
    }

    public create = async (data: object) => {
        const {password, id, ...user } = await UserRepository.save(data);

        this.eventDispatcher.dispatch('onUserCreate', user);

        return {id, ...user};
    }

    // public async updateOneById(id: number, data: object) {
    //     const user = await this.getRequestedUserOrFail(id);

    //     return await this.userRepository.updateUser(user, data);
    // }

    // public async deleteOneById(id: number) {
    //     return await this.userRepository.delete(id);
    // }

    // private async getRequestedUserOrFail(id: number, resourceOptions?: object) {
    //     let user = await this.userRepository.findOne({
    //         where: {
    //             id
    //         }
    //     });

    //     if (!user) {
    //         throw new UserNotFoundException();
    //     }

    //     return user;
    // }

}