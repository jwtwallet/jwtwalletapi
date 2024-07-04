import { subject } from "@casl/ability";
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";
import { CurrentUser } from "../auth/current-user.decorator";
import { ParseObjectIdPipe } from "../utils/objectId.transform";
import { PagedUserResponseDto } from "./dto/pagedUserResponse.dto";
import { QueryUsersDto } from "./dto/queryUsers.dto";
import { UserAccountsReponseDto } from "./dto/userAccountsResponse.dto";
import { UserResponseDto } from "./dto/userResponse.dto";
import { UserDocument } from "./model/user.model";
import { UserAccountAccess } from "./model/userAccountAccess.model";
import { UserService } from "./user.service";

@ApiTags("user")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@ApiBearerAuth()
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: "Get spesific user",
    type: UserResponseDto
  })
  @ApiParam({
    name: "userId",
    type: String,
    description: "User ID"
  })
  @Get(":userId")
  async findOne(
    @CurrentUser() user: UserDocument,
    @Param("userId", ParseObjectIdPipe) userId: Types.ObjectId
  ) {
    const abilities = this.userService.abilities(user);

    const userFound = await this.userService.findOne(userId);

    if (!userFound || !abilities.can("read", userFound)) {
      throw new NotFoundException("User not found");
    }

    return new UserResponseDto(userFound);
  }

  @ApiResponse({
    status: 200,
    description: "Get all user accounts",
    type: UserAccountsReponseDto
  })
  @ApiParam({
    name: "userId",
    type: String,
    description: "User ID"
  })
  @Get(":userId/accounts")
  async userAccounts(
    @CurrentUser() user: UserDocument,
    @Param("userId", ParseObjectIdPipe) userId: Types.ObjectId
  ) {
    const abilities = this.userService.abilities(user);

    const userFound = await this.userService.findOne(userId);

    if (!userFound || !abilities.can("read", userFound)) {
      throw new NotFoundException("User not found");
    }

    const accounts = userFound.accounts.filter((account) => {
      return abilities.can("read", subject("UserAccountAccess", account));
    });

    const response = new UserAccountsReponseDto(accounts);

    return response;
  }

  @ApiResponse({
    status: 201,
    description: "Associate user with account"
  })
  @ApiParam({
    name: "userEmail",
    type: String,
    description: "User Email"
  })
  @Post(":userEmail/accounts")
  async assotiateUserWithAccount(
    @CurrentUser() user: UserDocument,
    @Param("userEmail") userEmail: string,
    @Body() body: UserAccountAccess
  ) {
    const abilities = this.userService.abilities(user);

    if (userEmail === user.email) {
      throw new NotFoundException("Cannot associate self with account");
    }

    const userFound = await this.userService.findByEmail(userEmail);

    if (!userFound) {
      // Silently ignore if user not found
      return;
    }

    const existingAccount = userFound.accounts.find((account) => {
      return account.accountId.equals(body.accountId);
    });

    if (existingAccount) {
      // Silently ignore if the account already exists
      return;
    }

    const accountAccess = new UserAccountAccess();
    accountAccess.accountId = body.accountId;
    accountAccess.dateExp = body.dateExp;
    accountAccess.access = body.access;
    accountAccess.invite = body.invite;
    accountAccess.userId = userFound._id;

    if (!abilities.can("create", subject("UserAccountAccess", accountAccess))) {
      throw new NotFoundException("Cannot create account access");
    }

    userFound.accounts.push(accountAccess);

    await userFound.save();

    return;
  }

  @ApiResponse({
    status: 200,
    description: "Delete user account access"
  })
  @ApiParam({
    name: "userId",
    type: String,
    description: "User ID"
  })
  @ApiParam({
    name: "accountId",
    type: String,
    description: "Account ID"
  })
  @Delete(":userId/accounts/:accountId")
  async deleteUserAccountAccess(
    @CurrentUser() user: UserDocument,
    @Param("userId", ParseObjectIdPipe) userId: Types.ObjectId,
    @Param("accountId", ParseObjectIdPipe) accountId: Types.ObjectId
  ) {
    const abilities = this.userService.abilities(user);

    const userFound = await this.userService.findOne(userId);

    if (!userFound || !abilities.can("read", userFound)) {
      throw new NotFoundException("User not found");
    }

    const accountRow = userFound.accounts.find((account) => {
      return account.accountId.equals(accountId);
    });

    if (!accountRow) {
      throw new NotFoundException("Account not found");
    }

    if (!abilities.can("delete", subject("UserAccountAccess", accountRow))) {
      throw new NotFoundException("Cannot delete account");
    }

    userFound.accounts = userFound.accounts.filter((account) => {
      return !account.accountId.equals(accountId);
    });

    await userFound.save();

    return;
  }

  @ApiResponse({
    status: 200,
    description: "Accept account invite"
  })
  @ApiParam({
    name: "userId",
    type: String,
    description: "User ID"
  })
  @ApiParam({
    name: "accountId",
    type: String,
    description: "Account ID"
  })
  @Post(":userId/accounts/:accountId/accept")
  async acceptAccountInvite(
    @CurrentUser() user: UserDocument,
    @Param("userId", ParseObjectIdPipe) userId: Types.ObjectId,
    @Param("accountId", ParseObjectIdPipe) accountId: Types.ObjectId
  ) {
    const abilities = this.userService.abilities(user);

    const userFound = await this.userService.findOne(userId);

    if (!userFound || !abilities.can("read", userFound)) {
      throw new NotFoundException("User not found");
    }

    const accountRow = userFound.accounts.find((account) => {
      return account.accountId.equals(accountId);
    });

    if (!accountRow) {
      throw new NotFoundException("Account not found");
    }

    if (!abilities.can("accept", subject("UserAccountAccess", accountRow))) {
      throw new NotFoundException("Cannot delete account");
    }

    accountRow.invite = false;

    await userFound.save();

    return;
  }

  @ApiResponse({
    status: 200,
    description: "Get all users",
    type: PagedUserResponseDto
  })
  @Get()
  async findAll(
    @CurrentUser() user: UserDocument,
    @Query() query: QueryUsersDto
  ) {
    const abilities = this.userService.abilities(user);

    const filter = query.convertToQuery();

    const users = await this.userService
      .findAll(
        abilities,
        filter,
        query.limit,
        query.page * query.limit,
        "read",
        { _id: 1 }
      )
      .exec();

    const count = await this.userService
      .findAll(
        abilities,
        filter,
        query.limit,
        query.page * query.limit,
        "read",
        { _id: 1 }
      )
      .countDocuments();

    const usersResponse = new PagedUserResponseDto(users, query.page, count);

    return usersResponse;
  }
}
