import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../schema/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminSignInDto, VerifyOtpDto } from '../dto/admin-auth.dto';
import { failureResponse, successResponse } from 'src/utils/response';
import * as bcrypt from 'bcrypt';
import * as crypto from "crypto"
import * as colors from 'colors';
import { sendOTPByEmail } from 'src/mailer/send-email';
import { AuthPayload } from '../interface/auth-payload.interface';
import { User } from 'src/identity/schemas/user.schema';


@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(User.name) private adminModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ////////////////                Sign in an admin
  async signIn(dto: AdminSignInDto) {
    console.log(colors.green('Admin signing in...'));
  
    try {
      const admin = await this.adminModel.findOne({ email: dto.email });
  
      if (!admin || admin.role !== 'admin') {
        console.log(colors.red('Admin not found'));
        return failureResponse(400, 'Admin not found', false);
      }
  
      const isPasswordCorrect = await bcrypt.compare(dto.password, admin.password);
      if (!isPasswordCorrect) {
        return failureResponse(401, 'Invalid credentials', false);
      }
  
      const otp = crypto.randomInt(1000, 9999).toString();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry
  
      admin.otp = otp;
      admin.otpExpires = otpExpiresAt;
      await admin.save();
  
      await sendOTPByEmail(dto.email, otp);
      console.log(colors.magenta(`OTP code: ${otp} sent to user: ${dto.email}`));
  
      return successResponse(200, true, 'OTP sent to email');
    } catch (error) {
      console.error(colors.red('Error during admin sign-in:'), error);
      return failureResponse(500, 'Internal server error', false);
    }
  }
  

  // ////////////////                Verify OTP
  async verifyOtp(dto: VerifyOtpDto) {
    console.log(colors.green('Verifying OTP...'));
  
    try {
      const admin = await this.adminModel.findOne({ email: dto.email });
  
      if (!admin || admin.otp !== dto.otp || !admin.otpExpires || admin.otpExpires < new Date()) {
        return failureResponse(400, 'Invalid or expired OTP', false);
      }
  
      // Clear OTP
      admin.otp = undefined;
      admin.otpExpires = undefined;
      await admin.save();
  
      const tokens = await this.generateTokens({
        sub: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      });
  
      await this.adminModel.findByIdAndUpdate(admin._id, {
        refreshToken: tokens.refreshToken,
      });
  
      const formatteduser = {
        accessToken: tokens.accessToken,
        id: admin._id,
        role: admin.role,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };
  
      return successResponse(200, true, 'Admin signed in successfully', undefined, formatteduser);
    } catch (error) {
      console.error(colors.red('Error during OTP verification:'), error);
      return failureResponse(500, 'Internal server error', false);
    }
  }
  

  private async generateTokens(payload: AuthPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
