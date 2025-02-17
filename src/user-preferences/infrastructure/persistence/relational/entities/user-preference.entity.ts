import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  JoinColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import {
  CommunicationStyle,
  Diet,
  Drinking,
  Education,
  Exercise,
  FutureFamily,
  Hobby,
  Language,
  LookingFor,
  PersonalityType,
  PetPreference,
  SleepHabit,
  Smoking,
  SocialMedia,
  ZodiacSign,
} from '../../../../../utils/enums/preferences.enum';
import { ProfileEntity } from '../../../../../profiles/infrastructure/persistence/relational/entities/profile.entity';

@Entity({
  name: 'user-preference',
})
export class UserPreferenceEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => ProfileEntity, (profile) => profile.userPreferences)
  @JoinColumn() // Thêm JoinColumn nếu là quan hệ one-to-one
  profile: ProfileEntity; // Thêm thuộc tính profile
  @OneToOne(() => UserEntity, { eager: true, cascade: true })
  @JoinColumn({ name: 'userId' }) // Thêm JoinColumn để xác định khóa ngoại
  user!: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'simple-array', nullable: true })
  hobbies: Hobby[];

  @Column({ type: 'simple-array', nullable: true })
  lookingFor: LookingFor[];

  @Column({ type: 'simple-array', nullable: true })
  languages: Language[];

  @Column({ type: 'simple-array', nullable: true })
  zodiacSigns: ZodiacSign[];

  @Column({ type: 'simple-array', nullable: true })
  education: Education[];

  @Column({ type: 'simple-array', nullable: true })
  futureFamily: FutureFamily[];

  @Column({ type: 'simple-array', nullable: true })
  personalityTypes: PersonalityType[];

  @Column({ type: 'simple-array', nullable: true })
  communicationStyles: CommunicationStyle[];

  @Column({ type: 'simple-array', nullable: true })
  petPreferences: PetPreference[];

  @Column({ type: 'simple-array', nullable: true })
  drinking: Drinking[];

  @Column({ type: 'simple-array', nullable: true })
  smoking: Smoking[];

  @Column({ type: 'simple-array', nullable: true })
  exercise: Exercise[];

  @Column({ type: 'simple-array', nullable: true })
  diet: Diet[];

  @Column({ type: 'simple-array', nullable: true })
  socialMedia: SocialMedia[];

  @Column({ type: 'simple-array', nullable: true })
  sleepHabits: SleepHabit[];
}
export { UserEntity };
