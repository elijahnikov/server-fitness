import { Field, InputType } from "type-graphql";

//input object for register/login
@InputType()
export class WorkoutDiaryInput {
    @Field()
    type: string;

    @Field({nullable: true})
    weight: number

    @Field({nullable: true})
    duration: number

    @Field()
    workoutId: number;
}
