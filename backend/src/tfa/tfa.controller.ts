//TODO this file is only for testing

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TFAService } from "./tfa.service";

@Controller("tfa")
export class TFAController {
  constructor(private readonly gameStatsService: TFAService) {}
}
