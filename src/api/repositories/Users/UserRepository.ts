import { User } from '@base/api/models/User';
import { AppDataSource } from '@base/database/data-source';

export const UserRepository = AppDataSource.getRepository(User)