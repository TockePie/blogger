import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UUID } from 'crypto'

export interface RequestWithUser extends Request {
  user: {
    authorId: UUID
    [key: string]: any
  }
}

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>()

    return req.user
  }
)
