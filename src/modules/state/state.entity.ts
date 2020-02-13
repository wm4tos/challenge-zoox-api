import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { City } from '../city/city.entity';

@Entity()
@Unique(['name', 'UF', 'id'])
export class State {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('char')
  name?: string;

  @Column({ type: 'char', length: 2 })
  UF?: string;

  @OneToMany(() => City, city => city.state)
  cities?: City[];
}
