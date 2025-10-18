import { Polling } from '@app/modules/polling/models/polling.entity';
import { UserPolling } from '@app/modules/user-polling/models/user-polling.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IPollingOption {
  id: number;
  option: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  pollingId: number;
  polling: Polling;
  userPolling: UserPolling[];
}

@Entity('polling_options')
export class PollingOption implements IPollingOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  option: string;

  @Column({ type: 'varchar' })
  desc: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Polling, (polling) => polling.pollingOption)
  @JoinColumn({ name: 'polling_id' })
  polling: Polling;

  @Column({
    type: 'int',
    name: 'polling_id',
  })
  pollingId: number;

  @OneToMany(() => UserPolling, (userPolling) => userPolling.pollingOption)
  userPolling: UserPolling[];
}
