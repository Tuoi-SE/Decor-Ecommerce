import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from '@/shared/base';

@Entity('attributes')
export class Attribute extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    code: string;

    @OneToMany(() => AttributeValue, (value) => value.attribute)
    values: AttributeValue[];
}

@Entity('attribute_values')
export class AttributeValue extends BaseEntity {
    @Column({ name: 'attribute_id' })
    attributeId: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    value: string;

    @Column({ name: 'value_code' })
    @IsNotEmpty()
    @IsString()
    valueCode: string;

    @ManyToOne(() => Attribute, (attribute) => attribute.values)
    @JoinColumn({ name: 'attribute_id' })
    attribute: Attribute;
}
