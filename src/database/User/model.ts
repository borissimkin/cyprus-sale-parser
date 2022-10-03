import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm"
import {ListeningWord} from "@/database/ListeningWord";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    telegramId: number
    @Column({nullable: true})
    isBlocked: boolean
    @OneToMany(() => ListeningWord, (listeningWord) => listeningWord.user)
    listeningWords: ListeningWord[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
