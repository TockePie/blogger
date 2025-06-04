import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Base path')
@Controller()
export class StartingController {
  constructor() {}

  @Get()
  @ApiOperation({
    summary: 'Get greeting message',
    description: 'Returns a simple greeting message in HTML format'
  })
  @ApiOkResponse({
    description:
      'Hello from NestJS! \n This is my first pet-project with Nest.js.',
    content: {
      'text/html': {
        schema: {
          type: 'string'
        }
      }
    }
  })
  getHtml(): string {
    return `
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
  }
}
