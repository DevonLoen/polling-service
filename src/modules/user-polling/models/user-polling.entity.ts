import { PollingOption } from '@app/modules/polling-option/models/polling-option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IUserPolling {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  pollingOption: PollingOption;
  pollingOptionId: number;
}

@Entity('user_pollings')
@Index('UQ_user_polling_choice', ['userId', 'pollingOptionId'], {
  unique: true,
})
export class UserPolling implements IUserPolling {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PollingOption, (pollingOption) => pollingOption.userPolling)
  @JoinColumn({ name: 'polling_option_id' })
  pollingOption: PollingOption;

  @Column({
    type: 'int',
    name: 'polling_option_id',
  })
  pollingOptionId: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;
}
