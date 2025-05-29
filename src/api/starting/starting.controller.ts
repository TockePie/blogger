import { Controller, Get, Res } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

@ApiTags('Base path')
@Controller()
export class StartingController {
  constructor() {}

  @Get()
  @ApiOperation({
    summary: 'Get greeting message',
    description: 'Returns a simple greeting message in plain text format'
  })
  @ApiOkResponse({
    description:
      'Hello from NestJS! \n This is my first pet-project with Nest.js.'
  })
  getHtml(@Res() res: Response): void {
    const html = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>My HTML Message</title>
            <style type="text/css">
                body { font-family: "Inter", sans-serif}
            </style>
        </head>
        <body>
            <h1>Hello from NestJS!</h1>
            <p>This is my first pet-project with Nest.js.</p>
        </body>
    </html>
    `
    res.type('html').send(html)
  }
}
