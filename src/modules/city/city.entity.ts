import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { State } from '../state/state.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('char')
  name: string;

  @ManyToOne(() => State, state => state.cities)
  state: State;
}
