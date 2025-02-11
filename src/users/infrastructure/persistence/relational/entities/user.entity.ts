import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ProfileEntity } from '../../../../../profiles/infrastructure/persistence/relational/entities/profile.entity';
import { InteractionEntity } from '../../../../../interactions/infrastructure/persistence/relational/entities/interaction.entity';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: String, nullable: true })
  location: string | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;
  @OneToMany(() => InteractionEntity, (interaction) => interaction.senderUserId)
  sentInteractions: InteractionEntity[];

  @OneToMany(
    () => InteractionEntity,
    (interaction) => interaction.receiverUserId,
  )
  receivedInteractions: InteractionEntity[];

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
  profile?: ProfileEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
