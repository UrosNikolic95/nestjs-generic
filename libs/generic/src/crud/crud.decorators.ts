import { Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { RequestManyResponeDto } from './crud.dto';

export function ApiPaginatedResponse<T>(entity: Type<T>) {
  return ApiResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(RequestManyResponeDto) },
        {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                $ref: getSchemaPath(entity),
              },
            },
          },
        },
      ],
    },
  });
}
