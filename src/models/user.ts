import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	username!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@Column({ default: true })
	status!: boolean;

	@CreateDateColumn()
	createdAt!: Date;
}
