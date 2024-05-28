import { Either } from '../../../shared/domain/either';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Contract, IdContract } from '../../domain/contract.entity';
import { IContractRepository } from '../../domain/contract.repository';

export class IdContractExistsInDatabaseValidator {
  constructor(private categoryRepo: IContractRepository) {}

  async validate(
    id_contract: string[],
  ): Promise<Either<IdContract[], NotFoundError[]>> {
    const idContract = id_contract.map((v) => new IdContract(v));

    const existsResult = await this.categoryRepo.existsById(idContract);
    return existsResult.not_exists.length > 0
      ? Either.fail(
          existsResult.not_exists.map((c) => new NotFoundError(c.id, Contract)),
        )
      : Either.ok(idContract);
  }
}
