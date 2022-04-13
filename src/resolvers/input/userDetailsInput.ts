import { Field, InputType } from "type-graphql";

//input object for register/login
@InputType()
export class UserDetailsInput {
    @Field()
    currentWeight: number;

    @Field()
    goalWeight: number;

    @Field()
    heightFeet: number;

    @Field()
    heightInches: number;

    @Field()
    age: number;

    @Field()
    gender: string;

    @Field()
    activityLevel: string;
}
