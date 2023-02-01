import { Get, Post, Controller, UploadedFile, UseInterceptors, Param, Res, UseGuards, Req, ParseFilePipeBuilder, HttpStatus } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Response, Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/auth.guard";

require("dotenv").config();

@UseGuards(AuthGuard)
@Controller()
export class UploadController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}
  
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads",
        async filename(_,file, callback) {
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join("")
          console.log("-=-=-=-=-=-=-" + randomName + "-=-=-=-=-=-=-")
          return callback(null, randomName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile(new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'jpeg|jpg|gif|png',
    })
    .addMaxSizeValidator({
      maxSize: 4000000
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),) file,
    @Req() request: Request
  ) {
    console.log("Uploading file:", file);
    // const userId = await this.authService.userId(request);
    // const user = await this.userService.getUserById(userId);
    return {
      url: `http://localhost:${process.env.BACKEND_PORT}/api/${file.path}`,
    };
  }

  @Get("uploads/:path")
  async getImage(@Param("path") path: string, @Res() res: Response) {
    res.sendFile(path, { root: "uploads" });
  }
}

