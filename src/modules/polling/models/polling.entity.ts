import { PollingOption } from '@app/modules/polling-option/models/polling-option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IPolling {
  id: number;
  question: string;
  link: string;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  pollingOption: PollingOption[];
}

@Entity('pollings')
export class Polling implements IPolling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  question: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'timestamp', name: 'expired_at' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PollingOption, (pollingOption) => pollingOption.polling)
  pollingOption: PollingOption[];

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;
}
