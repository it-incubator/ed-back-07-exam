import {ObjectId, WithId} from 'mongodb';
import {usersCollection} from '../db/runDb';

export type UserType = {
  name: string;
  login: string;
  passwordHash: string;
  age: number;
};
export const userRepository = {
  async getUsers(): Promise<WithId<UserType>[]> {
    return usersCollection.find().toArray();
  },

  getUser(id: string): Promise<WithId<UserType> | null> {
    return usersCollection.findOne({ _id: new ObjectId(id)});
  },

  async createUser(name: string, login: string, passwordHash: string, age: number): Promise<ObjectId> {
    const result = await usersCollection.insertOne({ name, login, passwordHash, age });

    return result.insertedId;
  },

  async updateUser(id: string, { name, login, age }: Omit<UserType, 'passwordHash'>): Promise<void> {
    await usersCollection.updateOne({ _id: new ObjectId(id) }, { name, login, age });
  },
};
