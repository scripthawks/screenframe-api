import { applyDecorators } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Trim } from '../transform';

export const TrimIsString = () => applyDecorators(Trim(), IsString());
