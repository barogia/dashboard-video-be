import { Controller } from '@nestjs/common';
import { WarningService } from './warning.service';

@Controller('warning')
export class WarningController {
  constructor(private readonly warningService: WarningService) {}
}
