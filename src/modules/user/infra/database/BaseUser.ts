import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class BaseUser {
  @PrimaryColumn()
  base_user_id: string;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  user_password: string;

  @Column({ default: false })
  is_email_verified?: boolean;

  @Column({ default: false })
  is_seller?: boolean;

  @Column({ default: false })
  is_deleted?: boolean;

  @Column()
  last_login?: Date;
}
