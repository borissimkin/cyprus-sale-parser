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

    @Column({nullable: true})
    receivedAdvertiseAt: Date

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    isPremium: boolean

    @UpdateDateColumn()
    updatedAt: Date;
}
