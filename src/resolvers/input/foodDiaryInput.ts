import { Field, InputType, Int } from "type-graphql";

//input object for register/login
@InputType()
export class FoodDiaryInput {
    @Field()
    type: string;

    @Field(() => Int)
    foodId: number;
}
