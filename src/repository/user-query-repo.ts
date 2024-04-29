import {ObjectId, WithId} from "mongodb";
import {usersCollection} from "../db/runDb";
import {UserType} from "./user-repository";

export type UserViewType = {
    name: string;
    login: string;
    id: string
}

export const userQueryRepository = {
    async getUsers(): Promise<UserViewType[]> {
        const results = await usersCollection.find().toArray();

        return results.map((result)=> ({
            name: result.name,
            login: result.login,
            id: result._id.toString(),
        }))
    },

    async getUser(id: string): Promise<UserViewType | null> {
        const result = await usersCollection.findOne({ _id: new ObjectId(id) });

        if(!result) {
            return null
        }

        return {
            name: result.name,
            login: result.login,
            id: result._id.toString(),
        }
    },
};