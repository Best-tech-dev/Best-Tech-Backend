import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/identity/schemas/user.schema';
import * as colors from 'colors';
import { successResponse } from 'src/utils/response';

@Injectable()
export class AdminService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getAllUsers(userpayload: any) {
        console.log(colors.green('Fetching all users...'));

        try {
            const users = await this.userModel.find().exec();
            if (!users || users.length === 0) {
                console.log(colors.red('No users found'));
                return successResponse(
                    200, 
                    true, 
                    'No users found',
                    0,
                );
            }
            console.log(colors.green(`Total of ${users.length} users found`));
            
            const formattedUsers = users.map(user => ({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));

            return successResponse(
                200,
                true,
                'Users fetched successfully',
                users.length,
                formattedUsers,
            )
        } catch (error) {
            console.error(colors.red('Error fetching users:'));
            return successResponse(
                500,
                false,
                'Error fetching users',
            );
        }
    }

    // async getDashboard(userpayload: any) {
    //     console.log(colors.green('Fetching dashboard data...'));

    //     try {
    //         const totalUsers = await this.userModel.countDocuments().exec();
    //         console.log(colors.green(`Total users: ${totalUsers}`));

    //         return successResponse(
    //             200,
    //             true,
    //             'Dashboard data fetched successfully',
    //             undefined,
    //             { totalUsers },
    //         );
    //     } catch (error) {
    //         console.error(colors.red('Error fetching dashboard data:'));
    //         return successResponse(
    //             500,
    //             false,
    //             'Error fetching dashboard data',
    //         );
    //     }
    // }
}
