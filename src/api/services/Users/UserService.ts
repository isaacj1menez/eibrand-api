import { UserRepository } from "@base/api/repositories/Users/UserRepository";
import { EventDispatcher, EventDispatcherInterface } from "@base/decorators/EventDispatcher";
import { UserNotFoundException } from "@base/errors/Users/UserNotFoundException";
import { Service } from "typedi";

@Service()
export class UserService {
    constructor(@EventDispatcher() private eventDispatcher: EventDispatcherInterface) { }

    public getAll = async (offset?: number, limit?: number) => {
        const [entries, data] = await Promise.all([
            await UserRepository.count(),
            await UserRepository.find({
                skip: offset,
                take: limit
            })
        ]);
        const users = data.map(u => { const { password, ...user } = u; return user });
        return { entries, users }
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