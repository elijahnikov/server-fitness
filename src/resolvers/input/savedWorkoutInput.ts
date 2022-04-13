import { Field, InputType } from "type-graphql";

//input object for register/login
@InputType()
export class SavedWorkoutInput {
    @Field({nullable: true})
    title: string;

    @Field({nullable: true})
    type: string;

    @Field({nullable: true})
    sets: string;

    @Field({nullable: true})
    reps: string;

    @Field({nullable: true})
    weight: number;

    @Field({nullable: true})
    duration: number;
}
