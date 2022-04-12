import { ReferenceId } from '@concepta/nestjs-common';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PhotoEntityInterface } from './interfaces/photo-entity.interface';

@Entity()
export class Photo implements PhotoEntityInterface {
  @PrimaryGeneratedColumn('uuid')
  id: ReferenceId;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('int', { default: 0 })
  views: number;

  @Column()
  isPublished: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
