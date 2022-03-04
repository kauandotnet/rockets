import {
  CrudBody,
  CrudCreateOne,
  CrudDeleteOne,
  CrudReadAll,
  CrudReadOne,
  CrudRequest,
  CrudRequestInterface,
  CrudUpdateOne,
  CrudControllerInterface,
  CrudController,
  CrudCreateMany,
} from '@rockts-org/nestjs-crud';
import { UserCrudService } from './services/user-crud.service';
import { UserEntityInterface } from './interfaces/user-entity.interface';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserCreateManyDto } from './dto/user-create-many.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserManyDto } from './dto/user-many.dto';
import { UserService } from './services/user.service';
import { UserCreateEncryptedDto } from './dto/user-create-encrypted.dto';

/**
 * User controller.
 */
@CrudController({
  path: 'user',
  model: {
    type: UserDto,
    manyType: UserManyDto,
  },
})
export class UserController
  implements CrudControllerInterface<UserEntityInterface>
{
  /**
   * Constructor.
   *
   * @param userCrudService instance of the user crud service
   */
  constructor(
    private userService: UserService,
    private userCrudService: UserCrudService,
  ) {}

  /**
   * Get many
   *
   * @param crudRequest the CRUD request object
   */
  @CrudReadAll()
  async getMany(@CrudRequest() crudRequest: CrudRequestInterface) {
    return this.userCrudService.getMany(crudRequest);
  }

  /**
   * Get one
   *
   * @param crudRequest the CRUD request object
   */
  @CrudReadOne()
  async getOne(@CrudRequest() crudRequest: CrudRequestInterface) {
    return this.userCrudService.getOne(crudRequest);
  }

  /**
   * Create many
   *
   * @param crudRequest the CRUD request object
   * @param userCreateManyDto user create many dto
   */
  @CrudCreateMany()
  async createMany(
    @CrudRequest() crudRequest: CrudRequestInterface,
    @CrudBody() userCreateManyDto: UserCreateManyDto,
  ) {
    // encrypted dtos
    const userCreateEncryptedDtos: UserCreateEncryptedDto[] = [];

    // loop all dtos
    for (const userCreateDto of userCreateManyDto.bulk) {
      // encrypt it
      const userCredentialsDto = await this.userService.encryptPassword(
        userCreateDto,
        UserCreateEncryptedDto,
      );

      // push on array
      userCreateEncryptedDtos.push(userCredentialsDto);
    }
    // overwrite
    userCreateManyDto.bulk = userCreateEncryptedDtos;
    // call crud service to create
    return this.userCrudService.createMany(crudRequest, userCreateManyDto);
  }

  /**
   * Create one
   *
   * @param crudRequest the CRUD request object
   * @param userCreateDto user create dto
   */
  @CrudCreateOne()
  async createOne(
    @CrudRequest() crudRequest: CrudRequestInterface,
    @CrudBody() userCreateDto: UserCreateDto,
  ) {
    // encrypt the password
    const userCreateEncryptedDto = await this.userService.encryptPassword(
      userCreateDto,
      UserCreateEncryptedDto,
    );
    // call crud service to create
    return this.userCrudService.createOne(crudRequest, userCreateEncryptedDto);
  }

  /**
   * Update one
   *
   * @param crudRequest the CRUD request object
   * @param userUpdateDto user update dto
   */
  @CrudUpdateOne()
  async updateOne(
    @CrudRequest() crudRequest: CrudRequestInterface,
    @CrudBody() userUpdateDto: UserUpdateDto,
  ) {
    return this.userCrudService.updateOne(crudRequest, userUpdateDto);
  }

  /**
   * Delete one
   *
   * @param crudRequest the CRUD request object
   */
  @CrudDeleteOne()
  async deleteOne(@CrudRequest() crudRequest: CrudRequestInterface) {
    return this.userCrudService.deleteOne(crudRequest);
  }
}
