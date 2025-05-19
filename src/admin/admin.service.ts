import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/identity/schemas/user.schema';
import * as colors from 'colors';
import { successResponse } from 'src/utils/response';
import { Service } from 'src/services/schema/services.schema';
import { Category } from 'src/services/schema/category.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Service.name) private ServiceModel: Model<Service>,
        @InjectModel(Category.name) private CategoryModel: Model<any>,
    ) {}

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

    // This function fetches the dashboard data for the admin
    async getDashboard(userpayload: any) {
        console.log(colors.green('Fetching dashboard data...'));

        const loggedInUser = await this.userModel.findById(userpayload.userId).exec();
        // console.log("logged in user: ", loggedInUser);
        

        try {
            const totalUsers = await this.userModel.countDocuments().exec();
            const totalServices = await this.ServiceModel.countDocuments().exec();
            const totalCategories = await this.CategoryModel.countDocuments().exec();
            const totalEnrollments = 0;
            const totalRevenues = 0;

            const formattedRes = {
                totalUsers,
                totalServices,
                totalCategories,
                totalEnrollments,
                totalRevenues,
                loggedInUser: {
                    id: loggedInUser?._id,
                    email: loggedInUser?.email,
                    firstName: loggedInUser?.firstName,
                    lastName: loggedInUser?.lastName,
                    role: loggedInUser?.role,
                    createdAt: loggedInUser?.createdAt,
                    updatedAt: loggedInUser?.updatedAt,
                },
            }

            return successResponse(
                200,
                true,
                'Dashboard data fetched successfully',
                undefined,
                { 
                    formattedRes
                 },
            );
        } catch (error) {
            console.error(colors.red('Error fetching dashboard data: '), error);
            return successResponse(
                500,
                false,
                'Error fetching dashboard data',
            );
        }
    }
}
