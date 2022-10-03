import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "@/database/User";

@Entity()
export class ListeningWord {
    @PrimaryGeneratedColumn()
    id: number
    @Column("text")
    word: string

    @Column()
    userId: number

    @ManyToOne(() => User, (user) => user.listeningWords)
    @JoinColumn({name: 'userId', referencedColumnName: 'id'})
    user: User

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // слишком много нюансов, буду пока что удалять
    // @Column({nullable: true})
    // isDeleted: boolean
}
