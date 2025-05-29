import { Injectable, NestMiddleware } from '@nestjs/common'
import chalk from 'chalk'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleWare implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      chalk.greenBright(
        `Request: ${JSON.stringify(
          {
            headers: req.headers,
            body: req.body as Record<string, unknown>,
            originalUrl: req.originalUrl,
            date: new Date()
          },
          null,
          2
        )}`
      )
    )

    res.on('finish', () => {
      console.log(
        chalk.blueBright(
          `Response: ${JSON.stringify(
            {
              statusCode: res.statusCode,
              statusMessage: res.statusMessage,
              headers: res.getHeaders(),
              date: new Date()
            },
            null,
            2
          )}`
        )
      )
    })

    if (next) {
      next()
    }
  }
}
