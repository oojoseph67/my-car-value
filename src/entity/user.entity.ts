// import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToMany,
} from 'typeorm';
import { ReportEntity } from './report.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[];

  @AfterInsert()
  logInsert() {
    console.log(`User with ID ${this.id} has been inserted.`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User with ID ${this.id} has been removed.`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User with ID ${this.id} has been removed.`);
  }
}
