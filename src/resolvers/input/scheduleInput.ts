import { Field, InputType } from "type-graphql";

//input object for register/login
@InputType()
export class ScheduleInput {
    @Field({nullable: true})
    title: string;

    @Field({nullable: true})
    type: string;

    @Field({nullable: true})
    day: string;

    @Field({nullable: true})
    duration: number;
}
