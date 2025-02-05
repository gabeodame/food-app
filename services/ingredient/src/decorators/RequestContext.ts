import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.context; // Return the `context` property set by middleware
  },
);
