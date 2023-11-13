import {
  IGenerateModule,
  IGenericAuthModuleParams,
} from '../interfaces/generate-module.interface';
import { authControllerFactory } from './auth-controller.factory';
import { authEntityFactory } from './auth-entity.factory';
import { authGuardFactory } from './auth-guard.factory';
import { authModuleFactory } from './auth-module.factory';
import { authStrategyFactory } from './auth-strategy.factory';
import { authSubscriberFactory } from './auth-subscriber.factory';
import { authServiceFactory } from './auth.service.facotry';

export function authFactory(params: IGenericAuthModuleParams) {
  const data = {
    ...params,
    databaseName: params.databaseUrl ? `${params.name}-database` : undefined,
    jwtLabel: `${params.name}-jwt`,
    localLabel: `${params.name}-local`,
  } as IGenerateModule;
  authEntityFactory(data);
  authServiceFactory(data);
  authSubscriberFactory(data);
  authStrategyFactory(data);
  authGuardFactory(data);
  authControllerFactory(data);
  authModuleFactory(data);
  return data;
}
