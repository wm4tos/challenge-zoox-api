import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { City } from '../city/city.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('char')
  name: string;

  @Column({ type: 'char', length: 2 })
  UF: string;

  @OneToMany(type => City, city => city.state)
  cities: City[];
}
